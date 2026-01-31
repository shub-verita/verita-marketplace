interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 6L16 26L28 6"
        stroke="#0f172a"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16L16 26"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="36"
        y="23"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="600"
        fill="#0f172a"
      >
        Verita Marketplace
      </text>
    </svg>
  );
}
