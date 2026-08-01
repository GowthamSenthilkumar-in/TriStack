import React from 'react';

interface CertifyXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const CertifyXLogo: React.FC<CertifyXLogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-sm' }
  };

  const dims = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Professional Crest Shield Logo Mark */}
      <div className={`relative ${dims.icon} shrink-0 group`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Main Shield Gradient: Royal Navy to Sapphire & Deep Violet */}
            <linearGradient id="cxShieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#1e3a8a" />
              <stop offset="85%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            {/* Gold Frame Gradient */}
            <linearGradient id="cxGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Glowing X Diagonal Gradient */}
            <linearGradient id="cxXGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* High-Gloss Overlay */}
            <linearGradient id="cxGloss" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            {/* Soft Outer Glow Filter */}
            <filter id="cxGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Gold Shield Border */}
          <path
            d="M 60 6 C 92 6 112 18 112 48 C 112 84 60 114 60 114 C 60 114 8 84 8 48 C 8 18 28 6 60 6 Z"
            fill="url(#cxGoldRim)"
          />

          {/* Inner Navy Shield Body */}
          <path
            d="M 60 12 C 87 12 104 22 104 48 C 104 79 60 106 60 106 C 60 106 16 79 16 48 C 16 22 33 12 60 12 Z"
            fill="url(#cxShieldBody)"
          />

          {/* Top High-Gloss Facet */}
          <path
            d="M 60 12 C 87 12 104 22 104 48 C 104 55 98 60 85 52 C 70 42 50 42 35 52 C 22 60 16 55 16 48 C 16 22 33 12 60 12 Z"
            fill="url(#cxGloss)"
          />

          {/* Cryptographic Ledger Mesh Matrix Lines */}
          <path
            d="M 36 50 H 84 M 42 66 H 78 M 48 82 H 72"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.2"
          />

          {/* Stylized Modern X & Integrated Check Mark */}
          <g filter="url(#cxGlowFilter)">
            {/* Primary Arm \ */}
            <path
              d="M 38 38 L 82 82"
              stroke="url(#cxXGlowGrad)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Secondary Cross / & Verification Hook */}
            <path
              d="M 82 38 L 50 72 L 38 60"
              stroke="#ffffff"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Golden Diamond Node Anchor */}
          <polygon points="60,34 64,38 60,42 56,38" fill="#fbbf24" />
          {/* Emerald Verification Dot */}
          <circle cx="82" cy="38" r="4.5" fill="#10b981" />
        </svg>
      </div>

      {/* Professional Text Branding */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-serif font-extrabold tracking-tight ${dims.text} leading-none flex items-center`}>
            <span className="text-[#1e3a8a] dark:text-blue-400">Certify</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent px-0.5">
              X
            </span>
          </div>
          <span className={`font-sans tracking-widest uppercase font-bold text-slate-500 dark:text-slate-400 ${dims.sub}`}>
            Digital Ledger Vault
          </span>
        </div>
      )}
    </div>
  );
};
