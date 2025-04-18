interface SuperfanLogoProps {
  className?: string
  inverted?: boolean
}

export function SuperfanLogo({ className = "", inverted = false }: SuperfanLogoProps) {
  const strokeColor = inverted ? "#0f172a" : "#ffffff"

  return (
    <svg
      width="220"
      height="40"
      viewBox="0 0 1200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon with S shape */}
      <path d="M210 20 L290 60 L290 160 L210 200 L130 160 L130 60 Z" stroke={strokeColor} strokeWidth="4" fill="none" />
      <path d="M170 70 L230 100 L170 130 L230 160" stroke={strokeColor} strokeWidth="4" fill="none" />

      {/* SUPERFAN text */}
      <path
        d="M420 60 C400 60 385 70 385 90 C385 110 400 120 420 120 C440 120 455 110 455 90 C455 70 440 60 420 60 Z M420 40 C450 40 475 60 475 90 C475 120 450 140 420 140 C390 140 365 120 365 90 C365 60 390 40 420 40 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
      <path d="M500 40 L500 140 L520 140 L520 40 Z" stroke={strokeColor} strokeWidth="4" fill="none" />
      <path
        d="M550 40 L550 140 L570 140 L570 100 C570 80 580 70 600 70 C620 70 630 80 630 100 L630 140 L650 140 L650 95 C650 65 635 40 600 40 C565 40 550 65 550 95 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M680 40 L680 140 L700 140 L700 40 Z M680 40 L750 40 L750 60 L700 60 Z M680 80 L740 80 L740 100 L700 100 Z M680 140 L750 140 L750 120 L700 120 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M780 40 L780 140 L800 140 L800 40 Z M780 40 L850 40 L850 60 L800 60 Z M780 80 L840 80 L840 100 L800 100 Z M780 140 L850 140 L850 120 L800 120 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M880 40 L880 140 L900 140 L900 40 Z M880 40 L950 40 L950 60 L900 60 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M980 40 L1030 140 L1050 140 L1100 40 L1080 40 L1040 120 L1000 40 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M1130 40 L1130 140 L1150 140 L1150 40 Z M1130 40 L1180 40 L1180 60 L1150 60 Z M1130 140 L1180 140 L1180 120 L1150 120 Z"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
      />
    </svg>
  )
}
