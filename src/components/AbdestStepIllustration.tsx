import React from 'react';

interface AbdestIllustrationProps {
  illustrationKey: string;
  className?: string;
}

export const AbdestStepIllustration: React.FC<AbdestIllustrationProps> = ({
  illustrationKey,
  className = "w-28 h-28"
}) => {
  return (
    <div className={`flex items-center justify-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-emerald-600 dark:text-emerald-400"
      >
        {/* Water drops background decorative */}
        <circle cx="20" cy="25" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="82" cy="30" r="2.5" fill="currentColor" opacity="0.3" />
        <path d="M50 12C50 12 45 20 45 24C45 26.7 47.2 29 50 29C52.7 29 55 26.7 55 24C55 20 50 12 50 12Z" fill="currentColor" opacity="0.4" />

        {illustrationKey === 'hands_intent' && (
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M35 60C35 48 42 42 50 42C58 42 65 48 65 60V80H35V60Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M42 42V30M50 42V26M58 42V30" />
            <path d="M30 65H70" strokeDasharray="3 3" />
          </g>
        )}

        {illustrationKey === 'wash_hands' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Two overlapping hands washing */}
            <path d="M32 75V52C32 46 38 42 44 48L52 56" />
            <path d="M68 75V52C68 46 62 42 56 48L48 56" />
            <circle cx="50" cy="62" r="6" fill="currentColor" fillOpacity="0.3" stroke="none" />
            <path d="M40 38C45 32 55 32 60 38" strokeDasharray="2 3" />
          </g>
        )}

        {illustrationKey === 'mouth' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Mouth / Smile with water splash */}
            <path d="M28 50Q50 78 72 50" />
            <path d="M32 50Q50 62 68 50" fill="currentColor" fillOpacity="0.1" />
            <circle cx="50" cy="38" r="4" fill="currentColor" />
            <path d="M44 32C47 28 53 28 56 32" />
          </g>
        )}

        {illustrationKey === 'nose' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Nose profile with inhaling water droplets */}
            <path d="M50 25V55L40 65H58" />
            <circle cx="44" cy="74" r="3" fill="currentColor" />
            <circle cx="54" cy="74" r="3" fill="currentColor" />
          </g>
        )}

        {illustrationKey === 'face' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Face oval being washed */}
            <ellipse cx="50" cy="50" rx="24" ry="30" fill="currentColor" fillOpacity="0.08" />
            <path d="M42 45H42.01M58 45H58.01" strokeWidth="5" />
            <path d="M44 65Q50 70 56 65" />
            {/* Washing water sweep around face */}
            <path d="M20 50C20 30 35 15 50 15C65 15 80 30 80 50" strokeDasharray="4 4" />
          </g>
        )}

        {illustrationKey === 'arms' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Arm up to elbow */}
            <path d="M25 65L65 35L75 45L35 75Z" fill="currentColor" fillOpacity="0.1" />
            <circle cx="75" cy="45" r="6" fill="currentColor" fillOpacity="0.4" />
            <path d="M45 42L55 52M35 50L45 60" />
          </g>
        )}

        {illustrationKey === 'head' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Head silhouette with hand wiping front to back */}
            <path d="M30 65C30 40 40 28 50 28C60 28 70 40 70 65" />
            <path d="M35 38C45 32 55 32 65 38" strokeWidth="5" strokeLinecap="round" className="text-amber-500" />
            <path d="M48 22L55 28L48 34" strokeWidth="2.5" />
          </g>
        )}

        {illustrationKey === 'ears_neck' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Ear outline being wiped */}
            <path d="M42 30C55 30 65 40 65 52C65 65 55 75 45 75C38 75 36 68 38 62C40 56 46 54 46 48C46 42 42 38 42 30Z" fill="currentColor" fillOpacity="0.1" />
            <circle cx="48" cy="50" r="3" fill="currentColor" />
          </g>
        )}

        {illustrationKey === 'feet' && (
          <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Foot and ankle */}
            <path d="M38 25V55L22 75H68L68 62L48 55V25" fill="currentColor" fillOpacity="0.1" />
            {/* Ankle bone highlight */}
            <circle cx="50" cy="55" r="4" fill="currentColor" />
            <path d="M24 75H68" strokeWidth="4" />
          </g>
        )}
      </svg>
    </div>
  );
};
