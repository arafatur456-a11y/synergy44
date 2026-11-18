import { useId } from 'react';
import type { BottleShape } from '@/lib/data';

type Props = {
  shape: BottleShape;
  colors: [string, string];
  cap: string;
  label: string;
  className?: string;
};

/**
 * Stylised vector bottle used until real product photography is wired in.
 * Replace with <Image src={product.image} .../> once you export WooCommerce media.
 */
export default function ProductVisual({ shape, colors, cap, label, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const body = `url(#b${uid})`;
  const shine = `url(#s${uid})`;
  const capFill = `url(#c${uid})`;
  const text = (y: number) => (
    <>
      <text x="60" y={y} textAnchor="middle" fontSize="7.5" letterSpacing="1.4" fill="rgba(255,255,255,.92)" fontWeight="700">
        {label.toUpperCase()}
      </text>
      <line x1="46" x2="74" y1={y + 6} y2={y + 6} stroke="rgba(255,255,255,.5)" strokeWidth=".6" />
      <text x="60" y={y + 15} textAnchor="middle" fontSize="4.6" letterSpacing="1.6" fill="rgba(255,255,255,.75)">
        ORGANIC · VEGAN
      </text>
    </>
  );

  return (
    <svg viewBox="0 0 120 210" className={className} role="img" aria-label={`${label} product illustration`}>
      <defs>
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
        <linearGradient id={`s${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`c${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={cap} />
          <stop offset=".45" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset="1" stopColor={cap} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="202" rx="38" ry="4" fill="#000" opacity=".45" />

      {shape === 'pump' && (
        <g>
          <rect x="42" y="38" width="38" height="13" rx="4" fill={capFill} />
          <rect x="76" y="41" width="26" height="6" rx="3" fill={capFill} />
          <rect x="56" y="50" width="9" height="10" fill={capFill} />
          <rect x="49" y="58" width="22" height="16" rx="2" fill={capFill} />
          <rect x="28" y="72" width="64" height="128" rx="14" fill={body} />
          <rect x="34" y="80" width="14" height="112" rx="7" fill={shine} opacity=".55" />
          <rect x="36" y="116" width="48" height="46" rx="4" fill="#fff" opacity=".1" />
          {text(134)}
        </g>
      )}

      {shape === 'spray' && (
        <g>
          <rect x="40" y="22" width="40" height="28" rx="8" fill={capFill} />
          <rect x="76" y="28" width="16" height="8" rx="2" fill={capFill} />
          <rect x="44" y="48" width="32" height="18" rx="3" fill={capFill} />
          <rect x="33" y="64" width="54" height="136" rx="12" fill={body} />
          <rect x="39" y="72" width="12" height="120" rx="6" fill={shine} opacity=".55" />
          <rect x="39" y="114" width="42" height="50" rx="4" fill="#fff" opacity=".1" />
          {text(134)}
        </g>
      )}

      {shape === 'dropper' && (
        <g>
          <rect x="50" y="26" width="20" height="50" rx="10" fill={cap} />
          <rect x="54" y="32" width="4" height="34" rx="2" fill="#fff" opacity=".25" />
          <rect x="42" y="74" width="36" height="26" rx="4" fill={capFill} />
          <rect x="26" y="98" width="68" height="102" rx="18" fill={body} />
          <rect x="32" y="106" width="14" height="86" rx="7" fill={shine} opacity=".55" />
          <rect x="34" y="128" width="52" height="46" rx="4" fill="#fff" opacity=".1" />
          {text(146)}
        </g>
      )}

      {shape === 'tube' && (
        <g>
          <rect x="26" y="14" width="68" height="10" rx="2" fill={colors[1]} />
          <path d="M28 22 H92 L84 172 Q84 176 80 176 H40 Q36 176 36 172 Z" fill={body} />
          <path d="M36 28 H48 L46 168 H40 Z" fill={shine} opacity=".5" />
          <rect x="41" y="174" width="38" height="26" rx="3" fill={cap} />
          <rect x="45" y="176" width="6" height="22" rx="2" fill="#fff" opacity=".2" />
          <rect x="38" y="70" width="44" height="50" rx="4" fill="#000" opacity=".06" />
          <text x="60" y="66" textAnchor="middle" fontSize="16" fontWeight="800" fill="rgba(0,0,0,.65)">
            No.3
          </text>
          <text x="60" y="90" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="rgba(0,0,0,.7)" fontWeight="700">
            {label.toUpperCase()}
          </text>
          <text x="60" y="102" textAnchor="middle" fontSize="4.6" letterSpacing="1.6" fill="rgba(0,0,0,.55)">
            BOND BUILDING
          </text>
        </g>
      )}
    </svg>
  );
}
