import React, { useMemo, useState } from 'react';
import { Eye, Search, Youtube } from 'lucide-react';
import { BodyCategory, EquipmentType, Exercise } from '../types';
import { EXERCISES, MUSCLE_LABELS } from '../data/exercises';
import { ExerciseAnimation } from './ExerciseAnimation';

interface ExerciseLibraryProps {
  customVideos: Record<string, string>;
  lastWeights: Record<string, string>;
  onOpenExercise: (exercise: Exercise) => void;
}

const CATEGORIES: ('Tümü' | BodyCategory)[] = [
  'Tümü',
  'Alt Vücut & Kalça',
  'Üst Vücut',
  'Core & Karın',
  'Kardiyo',
];

const EQUIPMENTS: ('Tümü' | EquipmentType)[] = [
  'Tümü',
  'Makine',
  'Dambıl',
  'Kablo',
  'Vücut Ağırlığı',
  'Kardiyo',
];

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  customVideos,
  lastWeights,
  onOpenExercise,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Tümü' | BodyCategory>('Tümü');
  const [selectedEquipment, setSelectedEquipment] = useState<'Tümü' | EquipmentType>('Tümü');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((ex) => {
      if (selectedCategory !== 'Tümü' && ex.category !== selectedCategory) return false;
      if (selectedEquipment !== 'Tümü' && ex.equipment !== selectedEquipment) return false;
      if (!q) return true;
      const haystack = `${ex.name} ${ex.englishName} ${ex.shortDesc} ${ex.primaryMuscles
        .map((m) => MUSCLE_LABELS[m])
        .join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, selectedCategory, selectedEquipment]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FDF4F2] via-[#FAF7F2] to-[#F2F6F3] border border-[#E6DDD0] p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
          Hareket Kütüphanesi
        </h1>
        <p className="text-sm text-[#6E685F] mt-1 max-w-2xl">
          Salona gitmeden önce veya makinenin başındayken hareketlerin nasıl yapıldığını animasyonlu
          form gösterimi, makine kurulum ipuçları ve uygulamalı videolarla incele.
        </p>

        {/* Search & Filters */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hareket veya kas grubu ara (ör. Leg Press, kalça, sırt, squat)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E6DDD0] text-sm text-[#2D2A26] focus:outline-none focus:border-[#6B8F78]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#6B8F78] text-white'
                    : 'bg-white text-[#6E685F] border border-[#EAE2D6] hover:border-[#C5D9CB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#6E685F] mr-1">Ekipman:</span>
            {EQUIPMENTS.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => setSelectedEquipment(eq)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  selectedEquipment === eq
                    ? 'bg-[#D98A7C] text-white'
                    : 'bg-[#FAF7F2] text-[#6E685F] border border-[#EAE2D6] hover:bg-white'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs font-medium text-[#6E685F] px-1">
        {filtered.length} hareket gösteriliyor
      </div>

      {/* Exercise Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#EAE2D6] p-8 text-center">
          <p className="text-sm font-semibold text-[#2D2A26]">Aramana uygun hareket bulunamadı.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('Tümü');
              setSelectedEquipment('Tümü');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#6B8F78] text-white text-xs font-semibold cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              onClick={() => onOpenExercise(ex)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenExercise(ex);
              }}
              className="group rounded-3xl bg-white border border-[#EAE2D6] hover:border-[#C5D9CB] hover:shadow-md transition p-4 flex flex-col justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-3">
                {/* Compact live animation preview */}
                <ExerciseAnimation kind={ex.animationKind} compact />

                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E2ECE5] text-[#456350]">
                      {ex.equipment}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F9E4DF] text-[#9A4A3C]">
                      {ex.difficulty}
                    </span>
                    {customVideos[ex.id] && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAE5F5] text-[#5B4D82] inline-flex items-center gap-1">
                        <Youtube className="w-3 h-3" /> Video
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#2D2A26] group-hover:text-[#547460] transition">
                    {ex.name}
                  </h3>
                  <p className="text-[11px] text-[#6E685F]">{ex.englishName}</p>
                  <p className="text-xs text-[#6E685F] mt-1.5 line-clamp-2 leading-relaxed">
                    {ex.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#6E685F] truncate">
                  {lastWeights[ex.id]
                    ? `Son: ${lastWeights[ex.id]} kg`
                    : ex.primaryMuscles.map((m) => MUSCLE_LABELS[m].split(' ')[0]).join(' • ')}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#547460] shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  Detay & Video
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
