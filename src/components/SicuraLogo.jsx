export default function SicuraLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sicura-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M200 60 L290 95 L290 195 C290 270, 250 320, 200 345 C150 320, 110 270, 110 195 L110 95 Z"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M135 200 C160 165, 180 150, 200 150 C220 150, 240 165, 265 200 C240 220, 220 232, 200 232 C180 232, 160 220, 135 200 Z"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="200" cy="198" r="22" fill="url(#sicura-logo-gradient)" />
    </svg>
  );
}
