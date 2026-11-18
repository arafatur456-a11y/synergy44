/**
 * Minimal sliding-window limiter (per server instance). Good enough to blunt abuse of the
 * contact and checkout endpoints; use a shared store (e.g. Upstash Redis) for strict,
 * multi-region limits.
 */
const buckets = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear(); // bound memory
  return recent.length > max;
}

export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
