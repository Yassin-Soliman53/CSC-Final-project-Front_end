import React from "react";

export default function FoodDoodlePattern({
  id = "food-doodles",
  opacity = 0.16,
  strokeColor = "#5a381e",
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="140" height="140" patternUnits="userSpaceOnUse">
          <g
            stroke={strokeColor}
            strokeWidth="1.6"
            fill="none"
            opacity={opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 22 L42 30 L26 48 Z" />
            <path d="M16 20 Q32 16 44 28" />
            <circle cx="27" cy="30" r="2" />
            <circle cx="32" cy="36" r="1.8" />
            <path d="M75 25 Q90 12 105 25 Z" />
            <line x1="73" y1="29" x2="107" y2="29" />
            <path d="M75 33 L105 33 Q103 40 90 40 Q77 40 75 33 Z" />
            <path d="M115 70 L120 102 L132 102 L137 70 Z" />
            <line x1="112" y1="70" x2="140" y2="70" />
            <path d="M126 70 L130 56 L136 56" />
            <path d="M25 85 C15 75 30 60 40 70 C45 75 42 84 36 87 L48 99 L42 105 L30 93 C27 94 28 88 25 85 Z" />
            <rect
              x="65"
              y="78"
              width="34"
              height="14"
              rx="7"
              transform="rotate(-18 82 85)"
            />
            <path d="M68 85 Q75 80 82 85 T96 82" />
            <circle cx="88" cy="120" r="11" />
            <circle cx="88" cy="120" r="4" />
            <path d="M20 118 L24 136 L40 136 L44 118 Z" />
            <line x1="25" y1="118" x2="25" y2="108" />
            <line x1="30" y1="118" x2="30" y2="105" />
            <line x1="35" y1="118" x2="35" y2="107" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}