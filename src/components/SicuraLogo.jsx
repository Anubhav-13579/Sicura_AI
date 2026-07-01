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
        {/* Futuristic Gradient */}
        <linearGradient id="sicura-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" /> {/* Cyan/Blue */}
          <stop offset="50%" stopColor="#8b5cf6" /> {/* Purple */}
          <stop offset="100%" stopColor="#ec4899" /> {/* Pink/Magenta */}
        </linearGradient>

        {/* Hardware-accelerated SVG glow filter */}
        <filter id="svg-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" result="blur1" />
          <feGaussianBlur stdDeviation="6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Glowing Shield Outline */}
      <path
        d="M200 45 L315 88 L315 190 C315 275, 265 338, 200 368 C135 338, 85 275, 85 190 L85 88 Z"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="11"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#svg-glow)"
        opacity="0.95"
      />

      {/* Inner Armored Shield Outline */}
      <path
        d="M200 70 L285 103 L285 185 C285 250, 248 298, 200 326 C152 298, 115 250, 115 185 L115 103 Z"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="12, 6"
        opacity="0.7"
      />

      {/* Cyber Eye - Upper Eyelid */}
      <path
        d="M135 200 Q200 130 265 200"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#svg-glow)"
      />

      {/* Cyber Eye - Lower Eyelid */}
      <path
        d="M135 200 Q200 270 265 200"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#svg-glow)"
      />

      {/* Glowing Outer Iris */}
      <circle
        cx="200"
        cy="200"
        r="28"
        fill="none"
        stroke="url(#sicura-logo-gradient)"
        strokeWidth="5"
        filter="url(#svg-glow)"
      />

      {/* Glowing Core Pupil */}
      <circle
        cx="200"
        cy="200"
        r="14"
        fill="url(#sicura-logo-gradient)"
        filter="url(#svg-glow)"
      />

      {/* Center White Cybernetic Glint */}
      <circle
        cx="200"
        cy="200"
        r="5"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  );
}

