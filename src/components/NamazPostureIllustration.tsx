import React from 'react';
import { GenderType } from '../types';

interface PostureProps {
  posture: 'kiyam' | 'ruku' | 'kavme' | 'secde' | 'celse' | 'kade' | 'selam_sag' | 'selam_sol';
  gender: GenderType;
  className?: string;
}

export const NamazPostureIllustration: React.FC<PostureProps> = ({
  posture,
  gender,
  className = "w-44 h-44"
}) => {
  const isFemale = gender === 'kadin';
  const primaryColor = isFemale ? "#ec4899" : "#10b981";
  const bodyColor = isFemale ? "#f43f5e" : "#059669";
  const headColor = isFemale ? "#fb7185" : "#34d399";
  const bgGlow = isFemale ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.12)";

  return (
    <div className={`relative flex items-center justify-center p-3 rounded-2xl ${className}`}>
      {/* Background soft aura */}
      <div
        className="absolute inset-2 rounded-full blur-xl pointer-events-none transition-all duration-500"
        style={{ backgroundColor: bgGlow }}
      />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md z-10"
      >
        {/* Ground / Seccade Line */}
        <path
          d="M20 180H180"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-stone-300 dark:text-stone-700"
        />
        <rect
          x="30"
          y="178"
          width="140"
          height="4"
          rx="2"
          fill="currentColor"
          className="text-emerald-500/20"
        />

        {/* Posture Renderers */}
        {posture === 'kiyam' && (
          <g className="transition-all duration-300">
            {/* Head */}
            <circle cx="100" cy="40" r="14" fill={headColor} />
            {isFemale && (
              /* Scarf/Hijab silhouette */
              <path
                d="M84 40C84 28 116 28 116 40C116 54 110 58 100 58C90 58 84 54 84 40Z"
                fill={headColor}
              />
            )}
            {/* Body */}
            <path
              d="M88 56L82 145H118L112 56Z"
              fill={bodyColor}
              rx="4"
            />
            {/* Arms */}
            {isFemale ? (
              /* Female hands folded over breast */
              <g>
                <path d="M85 64L96 82H104L115 64" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <rect x="92" y="77" width="16" height="8" rx="4" fill="white" />
              </g>
            ) : (
              /* Male hands folded below navel */
              <g>
                <path d="M85 64L95 98H105L115 64" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <rect x="91" y="94" width="18" height="8" rx="4" fill="white" />
              </g>
            )}
            {/* Legs & Feet */}
            <path d="M90 145V178" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
            <path d="M110 145V178" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
            <path d="M90 178H98" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-emerald-600" />
            <path d="M110 178H118" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-emerald-600" />
          </g>
        )}

        {(posture === 'ruku') && (
          <g className="transition-all duration-300">
            {/* Head bowed */}
            <circle cx={isFemale ? "85" : "75"} cy={isFemale ? "92" : "105"} r="13" fill={headColor} />
            {/* Torso horizontal (or slightly inclined for females) */}
            <path
              d={isFemale ? "M85 95L138 120L135 145L80 115Z" : "M75 108L140 108L136 142L72 135Z"}
              fill={bodyColor}
            />
            {/* Arms resting on knees */}
            <path
              d={isFemale ? "M95 105L120 142" : "M90 115L122 145"}
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Legs */}
            <path d="M135 142V178" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
            <path d="M142 142V178" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
            <path d="M135 178H148" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-emerald-600" />
          </g>
        )}

        {posture === 'kavme' && (
          <g className="transition-all duration-300">
            {/* Head */}
            <circle cx="100" cy="40" r="14" fill={headColor} />
            {/* Body */}
            <path d="M88 56L84 145H116L112 56Z" fill={bodyColor} />
            {/* Hands hanging loose at sides */}
            <path d="M85 62L80 110" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M115 62L120 110" stroke="white" strokeWidth="4" strokeLinecap="round" />
            {/* Legs */}
            <path d="M92 145V178" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
            <path d="M108 145V178" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
          </g>
        )}

        {posture === 'secde' && (
          <g className="transition-all duration-300">
            {/* Forehead on floor */}
            <circle cx="48" cy="165" r="12" fill={headColor} />
            {/* Back arched */}
            <path
              d={isFemale
                ? "M48 165Q75 130 115 145L125 175L70 175Z"
                : "M48 165Q75 105 125 125L135 175L80 175Z"
              }
              fill={bodyColor}
            />
            {/* Hands and arms */}
            {isFemale ? (
              /* Forearms flat on ground for women */
              <path d="M58 172H88" stroke="white" strokeWidth="4" strokeLinecap="round" />
            ) : (
              /* Elbows raised off ground for men */
              <path d="M52 168L68 145L80 172" stroke="white" strokeWidth="4" strokeLinecap="round" />
            )}
            {/* Feet tucked behind */}
            <circle cx="140" cy="172" r="5" fill="currentColor" className="text-emerald-500" />
          </g>
        )}

        {(posture === 'kade' || posture === 'celse') && (
          <g className="transition-all duration-300">
            {/* Head upright */}
            <circle cx="95" cy="85" r="13" fill={headColor} />
            {/* Torso sitting */}
            <path d="M84 98L80 152H118L112 98Z" fill={bodyColor} />
            {/* Hands on knees */}
            <path d="M84 110L70 155" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M108 110L98 155" stroke="white" strokeWidth="4" strokeLinecap="round" />
            {/* Folded legs */}
            <path d="M70 155Q95 175 130 172" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
          </g>
        )}

        {(posture === 'selam_sag' || posture === 'selam_sol') && (
          <g className="transition-all duration-300">
            {/* Head turned */}
            <circle cx={posture === 'selam_sag' ? "106" : "84"} cy="85" r="13" fill={headColor} />
            {/* Face direction arrow */}
            <path
              d={posture === 'selam_sag' ? "M112 85L124 85M120 81L125 85L120 89" : "M78 85L66 85M70 81L65 85L70 89"}
              stroke={primaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Torso */}
            <path d="M84 98L80 152H118L112 98Z" fill={bodyColor} />
            {/* Sitting legs */}
            <path d="M70 155Q95 175 130 172" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-stone-400 dark:text-stone-600" />
          </g>
        )}
      </svg>
    </div>
  );
};
