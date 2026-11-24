import React from 'react';
import { Award, CalendarCheck, Clock, Dumbbell, Sparkles, Trash2 } from 'lucide-react';
import { UserState } from '../types';
import { EXERCISE_MAP } from '../data/exercises';
import { countThisWeekWorkouts, formatShortDate } from '../utils/storage';

interface ProgressViewProps {
  user: UserState;
  onDeleteWorkout: (id: string) => void;
}

const FEELING_LABEL = {
  harika: { text: 'Harika & Enerjik', cls: 'bg-[#E2ECE5] text-[#456350]' },
  iyi: { text: 'Dengeli & İyi', cls: 'bg-[#EAE5F5] text-[#5B4D82]' },
  zorlayici: { text: 'Biraz Zorladı', cls: 'bg-[#F9E4DF] text-[#9A4A3C]' },
};

export const ProgressView: React.FC<ProgressViewProps> = ({ user, onDeleteWorkout }) => {
  const thisWeekCount = countThisWeekWorkouts(user.completedWorkouts);
  const totalMinutes = user.completedWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalSets = user.completedWorkouts.reduce((sum, w) => sum + w.totalSets, 0);

  const weightEntries = Object.entries(user.lastWeights).filter(([, w]) => w.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#F6F4FA] via-[#FAF7F2] to-[#F2F6F3] border border-[#E6DDD0] p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
          Gelişimim & Geçmişim
        </h1>
        <p className="text-sm text-[#6E685F] mt-1">
          Her küçük adım büyük bir alışkanlığa dönüşür. Tamamladığın antrenmanlar ve kullandığın
          ağırlıklar burada otomatik saklanır.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
            <div className="text-xs text-[#6E685F] flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-[#6B8F78]" />
              Bu Hafta
            </div>
            <div className="text-2xl font-bold text-[#2D2A26] mt-1">
              {thisWeekCount}/{user.daysPerWeek}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
            <div className="text-xs text-[#6E685F] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#D98A7C]" />
              Toplam Antrenman
            </div>
            <div className="text-2xl font-bold text-[#2D2A26] mt-1">
              {user.completedWorkouts.length}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
            <div className="text-xs text-[#6E685F] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8D7EB8]" />
              Toplam Süre
            </div>
            <div className="text-2xl font-bold text-[#2D2A26] mt-1">{totalMinutes} dk</div>
          </div>

          <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
            <div className="text-xs text-[#6E685F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6B8F78]" />
              Tamamlanan Set
            </div>
            <div className="text-2xl font-bold text-[#2D2A26] mt-1">{totalSets}</div>
          </div>
        </div>
      </div>

      {/* Saved Exercise Weights */}
      <section className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-[#D98A7C]" />
          <h2 className="text-lg font-bold text-[#2D2A26]">Kayıtlı Son Ağırlıkların</h2>
        </div>

        {weightEntries.length === 0 ? (
          <p className="text-xs sm:text-sm text-[#6E685F] bg-[#FAF7F2] rounded-2xl p-4">
            Henüz ağırlık kaydı yok. İlk antrenmanında kullandığın ağırlıkları yazdığında bir
            sonraki hafta unutmaman için burada görünecek!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {weightEntries.map(([exerciseId, weight]) => {
              const ex = EXERCISE_MAP[exerciseId];
              if (!ex) return null;
              return (
                <div
                  key={exerciseId}
                  className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#2D2A26] truncate">{ex.name}</div>
                    <div className="text-[11px] text-[#6E685F]">{ex.equipment}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-[#EAE2D6] text-xs font-bold text-[#547460] shrink-0">
                    {weight} kg
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Workout History List */}
      <section className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-3">
        <h2 className="text-lg font-bold text-[#2D2A26]">Antrenman Geçmişi</h2>

        {user.completedWorkouts.length === 0 ? (
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] p-6 text-center space-y-1">
            <p className="text-sm font-semibold text-[#2D2A26]">Henüz tamamlanmış antrenman yok</p>
            <p className="text-xs text-[#6E685F]">
              Programım sekmesinden ilk antrenmanına başladığında geçmişin burada birikecek.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {user.completedWorkouts.map((w) => {
              const badge = FEELING_LABEL[w.feeling];
              return (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#6E685F]">
                        {formatShortDate(w.dateIso)}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#2D2A26]">{w.workoutTitle}</div>
                    <div className="text-xs text-[#6E685F] mt-0.5">
                      {w.durationMinutes} dk • {w.totalSets} set tamamlandı • {w.exercises.length} hareket
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteWorkout(w.id)}
                    className="p-2 rounded-xl text-[#6E685F] hover:text-[#9A4A3C] hover:bg-[#F9E4DF]/60 transition cursor-pointer"
                    title="Kaydı sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
