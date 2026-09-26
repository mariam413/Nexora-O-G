import React from 'react';

interface NexoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  subtitle,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-11 h-11', text: 'text-xl', sub: 'text-xs', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Nexora Stylized 'N' Icon in Light Blue, White & Light Green */}
      <div
        className={`${currentSize.icon} relative shrink-0 rounded-xl p-[1.5px] bg-gradient-to-br from-sky-400 via-white to-emerald-400 shadow-md shadow-sky-500/20`}
      >
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <defs>
              {/* Light Blue Gradient for Left Arm */}
              <linearGradient id="nexoraBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Light Green Gradient for Right Arm */}
              <linearGradient id="nexoraGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* White & Ice Sheen for Diagonal Fold */}
              <linearGradient id="nexoraWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>

            {/* Stylized N Geometry: Left Light-Blue Column */}
            <path
              d="M10 52V14C10 12.3431 11.3431 11 13 11H20C21.6569 11 23 12.3431 23 14V42L10 52Z"
              fill="url(#nexoraBlueGrad)"
            />

            {/* Diagonal White Energy Fold */}
            <path
              d="M18 12L46 48H52L24 12H18Z"
              fill="url(#nexoraWhiteGrad)"
              filter="drop-shadow(0px 0px 3px rgba(255,255,255,0.6))"
            />

            {/* Right Light-Green Pillar */}
            <path
              d="M41 22L54 12V50C54 51.6569 52.6569 53 51 53H44C42.3431 53 41 51.6569 41 50V22Z"
              fill="url(#nexoraGreenGrad)"
            />

            {/* Central Micro Accent Dot in White */}
            <circle cx="32" cy="30" r="2.5" fill="#ffffff" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`${currentSize.text} font-black tracking-wider text-sky-600 dark:text-sky-400 leading-none font-sans`}
            >
              NEXORA
            </span>
            <span
              className={`${currentSize.badge} font-extrabold uppercase tracking-widest rounded-md bg-gradient-to-r from-sky-500/20 via-emerald-500/15 to-emerald-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/40 leading-none`}
            >
              O&amp;G
            </span>
          </div>
          <p
            className={`${currentSize.sub} text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5`}
          >
            {subtitle || 'Materials & Procurement Intelligence'}
          </p>
        </div>
      )}
    </div>
  );
};
