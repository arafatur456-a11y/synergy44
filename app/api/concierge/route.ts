import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { CHAT_LIMITS, type ChatTurn } from '@/lib/concierge';
import { buildSystem, conciergeCatalog, guideReply, publicItem } from '@/lib/concierge-server';
import { clientIp, rateLimited } from '@/lib/rate-limit';

/**
 * Concierge endpoint.
 *   GET  → the catalog cards the drawer renders for [[product:slug]] markers.
 *   POST → { messages: ChatTurn[] } → streamed plain-text reply (header X-Concierge-Mode: ai | guide).
 *
 * With ANTHROPIC_API_KEY set, replies come from Claude grounded in the live catalog; otherwise
 * (or if the API is unavailable) the rule-based guide answers so the widget always works.
 */
export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-opus-5-5';

export async function GET() {
  const catalog = await conciergeCatalog();
  return NextResponse.json(
    { items: catalog.map(publicItem), mode: process.env.ANTHROPIC_API_KEY ? 'ai' : 'guide' },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
  );
}

function sanitizeTurns(input: unknown): ChatTurn[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const turns = input
    .slice(-CHAT_LIMITS.turns)
    .filter((t): t is ChatTurn => !!t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string')
    .map((t) => ({ role: t.role, content: t.content.slice(0, CHAT_LIMITS.chars).trim() }))
    .filter((t) => t.content);
  while (turns.length && turns[0].role !== 'user') turns.shift(); // conversation must open with the visitor
  return turns.length && turns[turns.length - 1].role === 'user' ? turns : null;
}

const textStream = (text: string, mode: 'ai' | 'guide') =>
  new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Concierge-Mode': mode, 'Cache-Control': 'no-store' } });

export async function POST(req: Request) {
  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const turns = sanitizeTurns(body.messages);
  if (!turns) return NextResponse.json({ error: 'Send at least one message.' }, { status: 400 });

  if (rateLimited(`concierge:${clientIp(req)}`, 24, 10 * 60_000)) {
    return NextResponse.json({ error: 'You’re asking faster than I can think — give me a minute and try again.' }, { status: 429 });
  }

  const catalog = await conciergeCatalog();
  const latest = turns[turns.length - 1].content;

  if (!process.env.ANTHROPIC_API_KEY) return textStream(guideReply(latest, catalog), 'guide');

  const { instructions, catalog: catalogText } = buildSystem(catalog);
  const client = new Anthropic();

  let stream;
  try {
    stream = client.beta.messages.stream(
      {
        model: MODEL,
        // Replies are short by design; this caps cost on a public endpoint while leaving room for thinking.
        max_tokens: 8000,
        // Chat turn: low effort keeps the drawer responsive; thinking stays adaptive (always on for this model).
        output_config: { effort: 'low' },
        // If a safety classifier declines, the API re-runs the turn on a fallback model automatically.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: [
          { type: 'text', text: instructions },
          // Stable per catalog revalidation → cached across visitors and turns
          { type: 'text', text: catalogText, cache_control: { type: 'ephemeral' } },
        ],
        messages: turns,
      },
      { signal: req.signal },
    );
  } catch (err) {
    console.error('[concierge] could not start stream', err);
    return textStream(guideReply(latest, catalog), 'guide');
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            sent = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          controller.enqueue(encoder.encode(`${sent ? '\n\n' : ''}I’m not able to help with that one, but I’d be glad to talk hair care, glass jewelry or booking a visit.`));
        } else if (!sent) {
          controller.enqueue(encoder.encode(guideReply(latest, catalog)));
        }
      } catch (err) {
        if (req.signal.aborted) return controller.close();
        if (err instanceof Anthropic.RateLimitError) console.warn('[concierge] rate limited by the API');
        else if (err instanceof Anthropic.AuthenticationError) console.error('[concierge] ANTHROPIC_API_KEY was rejected');
        else if (err instanceof Anthropic.APIError) console.error(`[concierge] API error ${err.status}`, err.message);
        else console.error('[concierge] stream failed', err);
        // Fall back to the guide so the visitor still gets a useful answer.
        controller.enqueue(encoder.encode(sent ? '\n\n(I lost my train of thought — could you ask that once more?)' : guideReply(latest, catalog)));
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Concierge-Mode': 'ai', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' },
  });
}
