import type { SVGProps } from 'react';

export type IconName =
  | 'logo'
  | 'move'
  | 'node'
  | 'edge'
  | 'trash'
  | 'clear'
  | 'complement'
  | 'check'
  | 'x'
  | 'matrix'
  | 'sliders'
  | 'refresh'
  | 'arrow'
  | 'info';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, ...rest }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  };

  switch (name) {
    case 'logo':
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2.2" />
          <circle cx="19" cy="6" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <path d="M7.2 6h9.6M6.7 7.8l4.1 8.4M17.3 7.8l-4.1 8.4" />
        </svg>
      );
    case 'move':
      return (
        <svg {...common}>
          <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12" />
          <path d="M11 12V5.5a1.5 1.5 0 0 1 3 0V12" />
          <path d="M14 12V7.5a1.5 1.5 0 0 1 3 0V13" />
          <path d="M17 11.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.1-2.8L5 13.4a1.6 1.6 0 0 1 2.5-1.9L10 14" />
        </svg>
      );
    case 'node':
      return (
        <svg {...common}>
          <circle cx="10" cy="12" r="4.5" />
          <path d="M18 8v8M14 12h8" />
        </svg>
      );
    case 'edge':
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="2.2" />
          <circle cx="19" cy="12" r="2.2" />
          <path d="M7.2 12h9.6" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" />
        </svg>
      );
    case 'clear':
      return (
        <svg {...common}>
          <path d="M4 20h16M6 16l8-8 4 4-8 8H6v-4Z" />
          <path d="m12 10 4 4" />
        </svg>
      );
    case 'complement':
      return (
        <svg {...common}>
          <path d="M8 7h12m0 0-4-4m4 4-4 4M16 17H4m0 0 4 4m-4-4 4-4" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'matrix':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M4 9h16M4 15h16M9 4v16M15 4v16" />
        </svg>
      );
    case 'sliders':
      return (
        <svg {...common}>
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="8" cy="17" r="2" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 1 0-2.4 5.7M20 4v7h-7" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14m0 0-5-5m5 5-5 5" />
        </svg>
      );
    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    default:
      return null;
  }
}
