import React from 'react';

interface BitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BitLogo: React.FC<BitLogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { w: 40, h: 44, text: 'text-xs', title: 'text-sm' },
    md: { w: 60, h: 64, text: 'text-sm', title: 'text-base' },
    lg: { w: 90, h: 96, text: 'text-base', title: 'text-xl' },
    xl: { w: 120, h: 128, text: 'text-lg', title: 'text-2xl' }
  };

  const dims = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
      <svg
        width={dims.w}
        height={dims.h}
        viewBox="0 0 200 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm transition-transform duration-200 hover:scale-105"
      >
        {/* Outer Omega Symbol (Ω) in Deep Blue */}
        <path
          d="M 30 145 H 62 C 65 145 68 140 70 134 C 80 92 102 75 125 75 C 148 75 170 92 180 134 C 182 140 185 145 188 145 H 220"
          stroke="#1e3a8a"
          strokeWidth="28"
          strokeLinecap="square"
          transform="translate(-25, 5)"
        />

        {/* 3D Isometric Gold Cube Container inside Omega */}
        <g transform="translate(68, 48)">
          {/* Top Face */}
          <path d="M 32 0 L 64 16 L 32 32 L 0 16 Z" fill="#d97706" opacity="0.9" />
          {/* Left Face */}
          <path d="M 0 16 L 32 32 L 32 68 L 0 52 Z" fill="#b45309" />
          {/* Right Face */}
          <path d="M 32 32 L 64 16 L 64 52 L 32 68 Z" fill="#78350f" />

          {/* Golden Letters B I T inside the cube faces */}
          {/* Letter B on Left Face */}
          <text x="8" y="44" fill="#fef3c7" fontSize="22" fontWeight="bold" fontFamily="serif" transform="skewY(24)">
            B
          </text>
          {/* Letter I in Center/Top */}
          <text x="27" y="22" fill="#ffffff" fontSize="20" fontWeight="bold" fontFamily="serif">
            I
          </text>
          {/* Letter T on Right Face */}
          <text x="40" y="58" fill="#fef3c7" fontSize="22" fontWeight="bold" fontFamily="serif" transform="skewY(-24)">
            T
          </text>
        </g>

        {/* Horizontal Line under Omega */}
        <line x1="20" y1="172" x2="180" y2="172" stroke="#1e3a8a" strokeWidth="3" />

        {/* "Stay Ahead" Motto */}
        <text
          x="100"
          y="198"
          textAnchor="middle"
          fill="#1e3a8a"
          fontSize="24"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing="0.5"
        >
          Stay Ahead
        </text>
      </svg>

      {showText && (
        <div className="mt-1 flex flex-col items-center">
          <span className={`font-serif font-bold tracking-tight text-[#1e3a8a] dark:text-blue-300 ${dims.title}`}>
            BANNARI AMMAN INSTITUTE OF TECHNOLOGY
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
            AUTONOMOUS • AFFILIATED TO ANNA UNIVERSITY
          </span>
        </div>
      )}
    </div>
  );
};
