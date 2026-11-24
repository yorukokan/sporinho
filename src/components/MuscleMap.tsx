import React from 'react';
import { MuscleId } from '../types';
import { MUSCLE_LABELS } from '../data/exercises';

interface MuscleMapProps {
  primary: MuscleId[];
  secondary: MuscleId[];
}

export const MuscleMap: React.FC<MuscleMapProps> = ({ primary, secondary }) => {
  const fillFor = (muscle: MuscleId) => {
    if (primary.includes(muscle)) return '#D98A7C'; // warm terracotta
    if (secondary.includes(muscle)) return '#87A892'; // soft sage
    return '#E8E0D5';
  };

  return (
    <div className="rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6E685F]">
          Çalışan Kas Grupları
        </span>
        <div className="flex items-center gap-3 text-[11px] text-[#6E685F]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D98A7C]" />
            Ana Hedef
          </span>
          {secondary.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#87A892]" />
              Destekleyici
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 py-1">
        {/* Front View */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 110 190" className="w-24 h-40">
            {/* Head & Neck */}
            <circle cx="55" cy="18" r="10" fill="#E8E0D5" />
            <rect x="51" y="28" width="8" height="7" rx="3" fill="#E8E0D5" />

            {/* Shoulders */}
            <ellipse cx="34" cy="43" rx="8" ry="7" fill={fillFor('shoulders')} />
            <ellipse cx="76" cy="43" rx="8" ry="7" fill={fillFor('shoulders')} />

            {/* Chest */}
            <path d="M39 38 Q55 34 71 38 L68 56 Q55 60 42 56 Z" fill={fillFor('chest')} />

            {/* Core / Abs */}
            <rect x="44" y="59" width="22" height="32" rx="8" fill={fillFor('core')} />

            {/* Arms (Biceps) */}
            <rect x="24" y="49" width="9" height="28" rx="4.5" fill={fillFor('biceps')} />
            <rect x="77" y="49" width="9" height="28" rx="4.5" fill={fillFor('biceps')} />
            {/* Forearms */}
            <rect x="22" y="79" width="8" height="24" rx="4" fill="#E8E0D5" />
            <rect x="80" y="79" width="8" height="24" rx="4" fill="#E8E0D5" />

            {/* Abductors / outer hip */}
            <ellipse cx="38" cy="100" rx="5.5" ry="12" fill={fillFor('abductors')} />
            <ellipse cx="72" cy="100" rx="5.5" ry="12" fill={fillFor('abductors')} />

            {/* Quads */}
            <rect x="40" y="95" width="13" height="42" rx="6.5" fill={fillFor('quads')} />
            <rect x="57" y="95" width="13" height="42" rx="6.5" fill={fillFor('quads')} />

            {/* Lower legs */}
            <rect x="42" y="140" width="10" height="38" rx="5" fill={fillFor('calves')} />
            <rect x="58" y="140" width="10" height="38" rx="5" fill={fillFor('calves')} />

            {primary.includes('cardio') && (
              <circle cx="55" cy="48" r="5" fill="#C67162" className="animate-soft-pulse" />
            )}
          </svg>
          <span className="text-[11px] font-medium text-[#6E685F] mt-1">Ön</span>
        </div>

        {/* Back View */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 110 190" className="w-24 h-40">
            {/* Head & Neck */}
            <circle cx="55" cy="18" r="10" fill="#E8E0D5" />
            <rect x="51" y="28" width="8" height="7" rx="3" fill="#E8E0D5" />

            {/* Upper back / Traps */}
            <path d="M38 37 L55 32 L72 37 L66 57 L44 57 Z" fill={fillFor('upper_back')} />

            {/* Rear Shoulders */}
            <ellipse cx="34" cy="43" rx="7" ry="6.5" fill={fillFor('shoulders')} />
            <ellipse cx="76" cy="43" rx="7" ry="6.5" fill={fillFor('shoulders')} />

            {/* Lats */}
            <path d="M38 50 L44 56 L45 80 L38 72 Z" fill={fillFor('lats')} />
            <path d="M72 50 L66 56 L65 80 L72 72 Z" fill={fillFor('lats')} />
            <rect x="46" y="58" width="18" height="24" rx="5" fill={fillFor('lats')} opacity="0.7" />

            {/* Triceps */}
            <rect x="24" y="49" width="9" height="28" rx="4.5" fill={fillFor('triceps')} />
            <rect x="77" y="49" width="9" height="28" rx="4.5" fill={fillFor('triceps')} />
            <rect x="22" y="79" width="8" height="24" rx="4" fill="#E8E0D5" />
            <rect x="80" y="79" width="8" height="24" rx="4" fill="#E8E0D5" />

            {/* Glutes */}
            <ellipse cx="47" cy="96" rx="10" ry="11" fill={fillFor('glutes')} />
            <ellipse cx="63" cy="96" rx="10" ry="11" fill={fillFor('glutes')} />

            {/* Hamstrings */}
            <rect x="40" y="108" width="13" height="31" rx="6" fill={fillFor('hamstrings')} />
            <rect x="57" y="108" width="13" height="31" rx="6" fill={fillFor('hamstrings')} />

            {/* Calves */}
            <rect x="42" y="141" width="10" height="36" rx="5" fill={fillFor('calves')} />
            <rect x="58" y="141" width="10" height="36" rx="5" fill={fillFor('calves')} />
          </svg>
          <span className="text-[11px] font-medium text-[#6E685F] mt-1">Arka</span>
        </div>
      </div>

      {/* Muscle pill badges */}
      <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
        {primary.map((m) => (
          <span
            key={m}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F9E4DF] text-[#9A4A3C]"
          >
            {MUSCLE_LABELS[m]}
          </span>
        ))}
        {secondary.map((m) => (
          <span
            key={m}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#E2ECE5] text-[#456350]"
          >
            {MUSCLE_LABELS[m]}
          </span>
        ))}
      </div>
    </div>
  );
};
