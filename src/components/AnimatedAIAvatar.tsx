import React from 'react';

interface AnimatedAIAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
  className?: string;
}

export const AnimatedAIAvatar: React.FC<AnimatedAIAvatarProps> = ({
  size = 'lg',
  isThinking = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: {
      container: 'w-7 h-7',
      iconSize: 'w-4 h-4',
      badge: 'p-1',
      glow: 'shadow-[0_0_10px_rgba(99,102,241,0.3)]'
    },
    md: {
      container: 'w-9 h-9',
      iconSize: 'w-5 h-5',
      badge: 'p-1.5',
      glow: 'shadow-[0_0_14px_rgba(99,102,241,0.35)]'
    },
    lg: {
      container: 'w-14 h-14',
      iconSize: 'w-8 h-8',
      badge: 'p-2.5',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.4)]'
    },
    xl: {
      container: 'w-20 h-20',
      iconSize: 'w-11 h-11',
      badge: 'p-3.5',
      glow: 'shadow-[0_0_30px_rgba(99,102,241,0.45)]'
    }
  }[size];

  return (
    <div
      role="img"
      aria-label="JobPulse AI Standard Icon"
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none transition-transform duration-300 hover:scale-105 ${sizeStyles.container} ${className}`}
    >
      {/* Outer ambient subtle glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/25 via-cyan-400/20 to-purple-500/25 transition-opacity duration-500 ${
          isThinking ? 'opacity-100 animate-pulse' : 'opacity-70 group-hover:opacity-100'
        } ${sizeStyles.glow}`}
      />

      {/* Rotating ring when thinking */}
      {isThinking && (
        <div className="absolute -inset-0.5 rounded-full border border-indigo-400/50 border-t-cyan-300 animate-spin" />
      )}

      {/* Standard Premium AI Disc Badge */}
      <div
        className={`relative w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-indigo-400/30 flex items-center justify-center overflow-hidden shadow-inner ${sizeStyles.badge}`}
      >
        {/* Subtle glass reflection accent */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/10 rounded-full blur-xs pointer-events-none" />

        {/* Standard Modern Generative AI Vector Mark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`${sizeStyles.iconSize} text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]`}
        >
          <defs>
            <linearGradient id="stdAiGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="stdAiGradSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Primary 4-point AI Star Flare */}
          <path
            d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z"
            fill="url(#stdAiGradPrimary)"
          />

          {/* Diagonal secondary AI micro-sparkle */}
          <path
            d="M19 3C19.3 4.8 20.7 6.2 22.5 6.5C20.7 6.8 19.3 8.2 19 10C18.7 8.2 17.3 6.8 15.5 6.5C17.3 6.2 18.7 4.8 19 3Z"
            fill="url(#stdAiGradSecondary)"
            opacity="0.9"
          />

          {/* Core gleam dot */}
          <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.95" />
        </svg>
      </div>
    </div>
  );
};
