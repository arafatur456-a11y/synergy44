import { useId } from 'react';
import type { ProductShape } from '@/lib/data/products';

type Props = {
  shape: ProductShape;
  colors: [string, string];
  cap: string;
  label: string;
  className?: string;
};

/**
 * Refined vector packshots used until real product photography is wired in.
 * Swap for <Image src={product.image} …/> once WooCommerce media is exported.
 */
export default function ProductVisual({ shape, colors, cap, label, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const body = `url(#b${uid})`;
  const shine = `url(#s${uid})`;
  const capFill = `url(#c${uid})`;
  const dark = shape === 'dryer' || shape === 'iron';
  const ink = dark ? 'rgba(255,255,255,.85)' : 'rgba(30,29,27,.72)';

  const Label = ({ y, sub = 'ORGANIC · VEGAN' }: { y: number; sub?: string }) => (
    <>
      <text stroke="none" x="60" y={y} textAnchor="middle" fontSize="7.5" letterSpacing="1.6" fill={ink} fontWeight="700" fontFamily="var(--font-sans)">
        {label.toUpperCase()}
      </text>
      <line x1="48" x2="72" y1={y + 6} y2={y + 6} stroke={ink} strokeOpacity=".5" strokeWidth=".5" />
      <text stroke="none" x="60" y={y + 15} textAnchor="middle" fontSize="4.4" letterSpacing="1.6" fill={ink} fillOpacity=".75" fontFamily="var(--font-sans)">
        {sub}
      </text>
    </>
  );

  return (
    <svg viewBox="0 0 120 210" className={className} role="img" aria-label={`${label} product illustration`}>
      <defs>
        {/* Cylinder shading: darker edges, lit centre-left — reads as a studio-lit object */}
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={colors[1]} />
          <stop offset=".24" stopColor={colors[0]} />
          <stop offset=".52" stopColor={colors[0]} />
          <stop offset=".86" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[1]} stopOpacity=".92" />
        </linearGradient>
        <filter id={`f${uid}`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id={`s${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`c${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={cap} />
          <stop offset=".45" stopColor="#fff" stopOpacity=".85" />
          <stop offset="1" stopColor={cap} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="203" rx="44" ry="5" fill="#000" opacity=".28" filter={`url(#f${uid})`} />
      <ellipse cx="60" cy="201.5" rx="30" ry="2" fill="#000" opacity=".35" filter={`url(#f${uid})`} />
      <g stroke="#111" strokeOpacity=".12" strokeWidth=".6">

      {shape === 'pump' && (
        <g>
          <rect x="42" y="38" width="38" height="12" rx="4" fill={capFill} />
          <rect x="76" y="41" width="26" height="5" rx="2.5" fill={capFill} />
          <rect x="56" y="49" width="9" height="10" fill={capFill} />
          <rect x="49" y="58" width="22" height="16" rx="2" fill={capFill} />
          <rect x="28" y="72" width="64" height="128" rx="14" fill={body} />
          <rect x="34" y="80" width="12" height="112" rx="6" fill={shine} opacity=".6" />
          <Label y={134} />
        </g>
      )}

      {shape === 'spray' && (
        <g>
          <rect x="40" y="22" width="40" height="28" rx="8" fill={capFill} />
          <rect x="76" y="28" width="16" height="8" rx="2" fill={capFill} />
          <rect x="44" y="48" width="32" height="18" rx="3" fill={capFill} />
          <rect x="33" y="64" width="54" height="136" rx="12" fill={body} />
          <rect x="39" y="72" width="11" height="120" rx="5.5" fill={shine} opacity=".6" />
          <Label y={134} />
        </g>
      )}

      {shape === 'dropper' && (
        <g>
          <rect x="50" y="26" width="20" height="50" rx="10" fill={cap} />
          <rect x="54" y="32" width="4" height="34" rx="2" fill="#fff" opacity=".3" />
          <rect x="42" y="74" width="36" height="26" rx="4" fill={capFill} />
          <rect x="26" y="98" width="68" height="102" rx="18" fill={body} />
          <rect x="32" y="106" width="12" height="86" rx="6" fill={shine} opacity=".6" />
          <Label y={146} />
        </g>
      )}

      {shape === 'tube' && (
        <g>
          <rect x="26" y="14" width="68" height="10" rx="2" fill={colors[1]} />
          <path d="M28 22 H92 L84 172 Q84 176 80 176 H40 Q36 176 36 172 Z" fill={body} />
          <path d="M36 28 H47 L45 168 H40 Z" fill={shine} opacity=".6" />
          <rect x="41" y="174" width="38" height="26" rx="3" fill={cap} />
          <Label y={92} sub="TREATMENT" />
        </g>
      )}

      {shape === 'jar' && (
        <g>
          <rect x="22" y="108" width="76" height="26" rx="7" fill={cap} />
          <rect x="22" y="128" width="76" height="4" fill="#000" opacity=".06" />
          <rect x="18" y="130" width="84" height="70" rx="16" fill={body} />
          <rect x="24" y="138" width="12" height="54" rx="6" fill={shine} opacity=".6" />
          <Label y={160} />
        </g>
      )}

      {shape === 'iron' && (
        <g>
          <path d="M60 182 C 60 194, 76 196, 84 204" stroke="#1E1D1B" strokeOpacity=".5" strokeWidth="3" fill="none" />
          <rect x="41" y="18" width="18" height="156" rx="9" fill={body} />
          <rect x="61" y="18" width="18" height="156" rx="9" fill={body} />
          <rect x="44" y="24" width="12" height="62" rx="4" fill={cap} opacity=".85" />
          <rect x="64" y="24" width="12" height="62" rx="4" fill={cap} opacity=".85" />
          <rect x="45" y="96" width="4" height="70" rx="2" fill={shine} opacity=".4" />
          <circle cx="60" cy="176" r="9" fill={capFill} />
          <text stroke="none" x="68" y="132" fontSize="5" letterSpacing="1.4" fill="rgba(255,255,255,.85)" fontWeight="700" transform="rotate(-90 68 132)" fontFamily="var(--font-sans)">
            {label.toUpperCase()}
          </text>
        </g>
      )}

      {shape === 'wand' && (
        <g>
          <rect x="54" y="12" width="12" height="10" rx="5" fill="#1E1D1B" opacity=".75" />
          <rect x="52" y="20" width="16" height="104" rx="8" fill={capFill} />
          <rect x="46" y="120" width="28" height="74" rx="13" fill={body} />
          <rect x="50" y="126" width="5" height="60" rx="2.5" fill={shine} opacity=".6" />
          <circle cx="66" cy="140" r="2.5" fill="#fff" opacity=".8" />
          <path d="M60 194 C 60 200, 70 202, 78 206" stroke="#1E1D1B" strokeOpacity=".4" strokeWidth="2.5" fill="none" />
        </g>
      )}

      {shape === 'dryer' && (
        <g>
          <rect x="40" y="90" width="24" height="104" rx="12" fill={body} transform="rotate(-6 52 90)" />
          <rect x="10" y="44" width="92" height="52" rx="26" fill={body} />
          <rect x="96" y="54" width="16" height="32" rx="4" fill={cap} />
          <circle cx="32" cy="70" r="15" fill="none" stroke={cap} strokeWidth="1.4" opacity=".7" />
          <circle cx="32" cy="70" r="9" fill="none" stroke={cap} strokeWidth="1" opacity=".5" />
          <rect x="54" y="50" width="34" height="5" rx="2.5" fill={shine} opacity=".35" />
          <text stroke="none" x="70" y="76" textAnchor="middle" fontSize="6.5" letterSpacing="1.6" fill="rgba(255,255,255,.85)" fontWeight="700" fontFamily="var(--font-sans)">
            {label.toUpperCase()}
          </text>
        </g>
      )}

      {shape === 'pouch' && (
        <g>
          <circle cx="44" cy="62" r="16" fill={colors[0]} stroke={colors[1]} strokeOpacity=".5" />
          <circle cx="64" cy="56" r="16" fill="#fff" stroke={colors[1]} strokeOpacity=".4" />
          <circle cx="82" cy="64" r="15" fill={colors[0]} stroke={colors[1]} strokeOpacity=".5" />
          <path d="M22 76 Q60 68 98 76 L96 186 Q96 198 84 198 H36 Q24 198 24 186 Z" fill={body} />
          <path d="M24 82 Q60 74 96 82" stroke="#fff" strokeOpacity=".6" strokeDasharray="2 2" fill="none" />
          <rect x="30" y="92" width="10" height="94" rx="5" fill={shine} opacity=".5" />
          <Label y={140} sub="REUSABLE" />
        </g>
      )}
      </g>
    </svg>
  );
}
