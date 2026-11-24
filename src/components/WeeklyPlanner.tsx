import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Flame,
  Heart,
  Play,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react';
import { DaysPerWeek, Exercise, GoalFocus, UserState, WorkoutDayPlan } from '../types';
import { DAYS_GUIDE, GOAL_INFO } from '../data/programs';
import { EXERCISE_MAP } from '../data/exercises';
import { LOVE_NOTES } from '../data/loveNotes';
import { countThisWeekWorkouts } from '../utils/storage';

interface WeeklyPlannerProps {
  user: UserState;
  weeklyPlan: WorkoutDayPlan[];
  onChangeDays: (days: DaysPerWeek) => void;
  onChangeGoal: (goal: GoalFocus) => void;
  onToggleWeekday: (weekdayIdx: number) => void;
  onUpdateName: (name: string) => void;
  onStartWorkout: (day: WorkoutDayPlan) => void;
  onOpenExercise: (exercise: Exercise) => void;
}

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  user,
  weeklyPlan,
  onChangeDays,
  onChangeGoal,
  onToggleWeekday,
  onUpdateName,
  onStartWorkout,
  onOpenExercise,
}) => {
  const [expandedDayId, setExpandedDayId] = useState<string>(weeklyPlan[0]?.id ?? '');
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name);
  const [noteIndex, setNoteIndex] = useState<number>(() => {
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return dayOfYear % LOVE_NOTES.length;
  });

  const currentNote = LOVE_NOTES[noteIndex % LOVE_NOTES.length];

  const completedThisWeek = countThisWeekWorkouts(user.completedWorkouts);
  const progressPct = Math.min(100, Math.round((completedThisWeek / user.daysPerWeek) * 100));

  // Suggest the next workout day based on how many completed this week
  const nextDayIndex = completedThisWeek % weeklyPlan.length;
  const recommendedDay = weeklyPlan[nextDayIndex] ?? weeklyPlan[0];

  const accentStyles = {
    sage: {
      badge: 'bg-[#E2ECE5] text-[#456350]',
      border: 'border-[#C5D9CB]',
      softBg: 'bg-[#F2F6F3]',
      btn: 'bg-[#6B8F78] hover:bg-[#547460]',
    },
    rose: {
      badge: 'bg-[#F9E4DF] text-[#9A4A3C]',
      border: 'border-[#F0C8BE]',
      softBg: 'bg-[#FDF4F2]',
      btn: 'bg-[#D98A7C] hover:bg-[#C67162]',
    },
    lavender: {
      badge: 'bg-[#EAE5F5] text-[#5B4D82]',
      border: 'border-[#D5CBEB]',
      softBg: 'bg-[#F6F4FA]',
      btn: 'bg-[#8D7EB8] hover:bg-[#73649E]',
    },
  };

  return (
    <div className="space-y-6">
      {/* Warm Welcome & Weekly Progress Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDF4F2] via-[#FAF7F2] to-[#F2F6F3] border border-[#F0C8BE]/80 p-5 sm:p-7 shadow-xs">
        {/* Decorative subtle floating hearts */}
        <Heart className="w-24 h-24 text-[#F0C8BE]/25 fill-[#F0C8BE]/20 absolute -top-5 -right-4 rotate-12 pointer-events-none" />
        <Heart className="w-10 h-10 text-[#D98A7C]/20 fill-[#D98A7C]/15 absolute bottom-4 right-1/3 -rotate-12 pointer-events-none hidden sm:block" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#F0C8BE]/80 text-xs font-semibold text-[#9A4A3C]">
              <Heart className="w-3.5 h-3.5 text-[#D98A7C] fill-[#D98A7C] animate-gentle-beat" />
              Sana Özel, Sevgiyle Hazırlanmış Spor Rehberin
            </div>

            {editingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateName(nameDraft.trim());
                  setEditingName(false);
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Aşkım / Adın..."
                  autoFocus
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#F0C8BE] text-lg font-display text-[#2D2A26] focus:outline-none focus:border-[#D98A7C]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#D98A7C] text-white text-sm font-semibold cursor-pointer"
                >
                  Kaydet
                </button>
              </form>
            ) : (
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2A26] tracking-tight flex flex-wrap items-center gap-x-2">
                <span>{user.name ? `Hoş geldin ${user.name}!` : 'Hoş geldin Aşkım!'}</span>
                <Heart className="w-6 h-6 text-[#D98A7C] fill-[#D98A7C] inline-block" />
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(user.name);
                    setEditingName(true);
                  }}
                  className="text-xs font-sans font-medium text-[#6E685F] hover:text-[#9A4A3C] underline underline-offset-4 cursor-pointer"
                >
                  {user.name ? 'düzenle' : 'ismini yaz'}
                </button>
              </h1>
            )}

            <p className="text-sm text-[#6E685F] leading-relaxed">
              Haftada kaç gün gideceğine henüz karar vermediysen hiç stres yapma birtanem! Aşağıdan
              gün sayısını istediğin hafta değiştir, programın otomatik olarak sana uyarlanır.
            </p>
          </div>

          {/* Weekly Progress Ring Card */}
          <div className="flex items-center gap-4 bg-white/95 rounded-2xl border border-[#F0C8BE]/70 p-4 shrink-0 shadow-2xs">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#F9E4DF"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#D98A7C"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - progressPct / 100)}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute text-sm font-bold text-[#2D2A26]">
                {completedThisWeek}/{user.daysPerWeek}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9A4A3C] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Bu Hafta
              </div>
              <div className="text-base font-bold text-[#2D2A26]">
                {completedThisWeek >= user.daysPerWeek
                  ? 'Harikasın Aşkım! ♥'
                  : `${user.daysPerWeek - completedThisWeek} gün kaldı`}
              </div>
              {recommendedDay && (
                <button
                  type="button"
                  onClick={() => onStartWorkout(recommendedDay)}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C67162] hover:text-[#9A4A3C] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Sıradaki: {recommendedDay.dayIndex}. Güne Başla
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sweet Interactive Love Note Card */}
        <div className="relative mt-5 pt-4 border-t border-[#F0C8BE]/60">
          <div className="rounded-2xl bg-white/85 border border-[#F0C8BE]/70 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FDF4F2] border border-[#F0C8BE]/70 text-[#D98A7C] flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-4.5 h-4.5 fill-[#D98A7C]" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9A4A3C]">
                  {currentNote.tag}
                </div>
                <p className="text-xs sm:text-sm text-[#2D2A26] leading-relaxed mt-0.5">
                  “{currentNote.text}”
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNoteIndex((i) => (i + 1) % LOVE_NOTES.length)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FDF4F2] hover:bg-[#F9E4DF] border border-[#F0C8BE]/80 text-xs font-semibold text-[#9A4A3C] transition shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Yeni Not ♥
            </button>
          </div>
        </div>
      </section>

      {/* Flexible Days & Goal Picker */}
      <section className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Days per week */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-[#2D2A26] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6B8F78]" />
                Bu Hafta Kaç Gün Gideceksin?
              </label>
              <span className="text-xs text-[#6E685F]">İstediğin an değiştir</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {([2, 3, 4, 5] as DaysPerWeek[]).map((d) => {
                const active = user.daysPerWeek === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onChangeDays(d);
                      setExpandedDayId(`${d}d-day-1`);
                    }}
                    className={`py-3 px-2 rounded-2xl border text-center transition cursor-pointer ${
                      active
                        ? 'bg-[#6B8F78] border-[#6B8F78] text-white shadow-sm'
                        : 'bg-[#FAF7F2] border-[#EAE2D6] text-[#2D2A26] hover:border-[#C5D9CB]'
                    }`}
                  >
                    <div className="text-lg font-bold leading-none">{d}</div>
                    <div
                      className={`text-[11px] mt-1 font-medium ${
                        active ? 'text-white/90' : 'text-[#6E685F]'
                      }`}
                    >
                      Gün / Hafta
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#6E685F] mt-2.5 leading-relaxed bg-[#FAF7F2] rounded-xl px-3 py-2">
              <span className="font-semibold text-[#547460]">
                {DAYS_GUIDE[user.daysPerWeek].splitName}:
              </span>{' '}
              {DAYS_GUIDE[user.daysPerWeek].summary}
            </p>
          </div>

          {/* Goal Focus */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-[#2D2A26] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#D98A7C]" />
                Antrenman Odağın
              </label>
            </div>
            <div className="space-y-2">
              {(Object.keys(GOAL_INFO) as GoalFocus[]).map((g) => {
                const active = user.goalFocus === g;
                const info = GOAL_INFO[g];
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onChangeGoal(g)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      active
                        ? 'bg-[#FDF4F2] border-[#D98A7C] shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#EAE2D6] hover:border-[#E6DDD0]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#2D2A26] flex items-center gap-2">
                        {info.label}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            active
                              ? 'bg-[#D98A7C] text-white'
                              : 'bg-[#EFE8DD] text-[#6E685F]'
                          }`}
                        >
                          {info.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E685F] mt-0.5">{info.shortDesc}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active ? 'border-[#D98A7C]' : 'border-[#D5CCC0]'
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-[#D98A7C]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Optional Weekly Day Chips */}
        <div className="pt-4 border-t border-[#F2ECE3]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-[#6E685F]">
              Hangi günler gitmeyi planlıyorsun? (İsteğe bağlı — dokunarak işaretle)
            </span>
            <span className="text-xs text-[#547460] font-medium">
              {user.scheduledWeekdays.length} gün seçili
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((dayLabel, idx) => {
              const selected = user.scheduledWeekdays.includes(idx);
              const planOrder = [...user.scheduledWeekdays].sort((a, b) => a - b).indexOf(idx);
              return (
                <button
                  key={dayLabel}
                  type="button"
                  onClick={() => onToggleWeekday(idx)}
                  className={`py-2 px-1 rounded-xl border text-center transition cursor-pointer ${
                    selected
                      ? 'bg-[#E2ECE5] border-[#87A892] text-[#2D2A26]'
                      : 'bg-[#FAF7F2] border-[#EAE2D6] text-[#6E685F] hover:bg-[#F2ECE3]'
                  }`}
                >
                  <div className="text-xs font-bold">{dayLabel}</div>
                  <div className="text-[10px] mt-0.5 truncate">
                    {selected && planOrder < weeklyPlan.length
                      ? `${planOrder + 1}. Gün`
                      : selected
                      ? 'Aktif'
                      : 'Dinlen'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workout Day Cards */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2D2A26]">
            {user.daysPerWeek} Günlük Programın
          </h2>
          <span className="text-xs text-[#6E685F]">
            Hareketlere dokunarak nasıl yapıldığını izle
          </span>
        </div>

        <div className="space-y-3">
          {weeklyPlan.map((day, idx) => {
            const isExpanded = expandedDayId === day.id;
            const style = accentStyles[day.accent];
            const isNext = idx === nextDayIndex;

            return (
              <div
                key={day.id}
                className={`rounded-3xl bg-white border transition overflow-hidden ${
                  isExpanded ? `${style.border} shadow-sm` : 'border-[#EAE2D6]'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setExpandedDayId(isExpanded ? '' : day.id)}
                    className="text-left flex-1 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.badge}`}>
                        {day.focusLabel}
                      </span>
                      {isNext && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#2D2A26] text-white flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#F0C8BE]" />
                          Sıradaki Antrenman
                        </span>
                      )}
                      <span className="text-xs text-[#6E685F] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />~{day.estimatedMinutes} dk •{' '}
                        {day.exercises.length} hareket
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#2D2A26]">{day.title}</h3>
                    <p className="text-xs sm:text-sm text-[#6E685F] mt-0.5">{day.subtitle}</p>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartWorkout(day)}
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-semibold transition shadow-xs cursor-pointer ${style.btn}`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Antrenmana Başla
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedDayId(isExpanded ? '' : day.id)}
                      className="w-10 h-10 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE3] border border-[#EAE2D6] flex items-center justify-center text-[#6E685F] cursor-pointer"
                      aria-label="Hareketleri göster"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Exercise List */}
                {isExpanded && (
                  <div className={`px-4 sm:px-5 pb-5 pt-2 border-t border-[#F2ECE3] ${style.softBg}/40`}>
                    <div className="text-xs font-semibold text-[#6E685F] mb-2.5 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#D98A7C]" />
                      5 dk ısınma → Aşağıdaki {day.exercises.length} hareket → 3 dk esneme
                    </div>

                    <div className="space-y-2">
                      {day.exercises.map((item, i) => {
                        const ex = EXERCISE_MAP[item.exerciseId];
                        if (!ex) return null;
                        const lastW = user.lastWeights[ex.id];
                        return (
                          <div
                            key={`${day.id}-${ex.id}-${i}`}
                            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#EAE2D6] hover:border-[#C5D9CB] transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-7 h-7 rounded-xl bg-[#FAF7F2] text-xs font-bold text-[#547460] flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[#2D2A26] truncate">
                                  {ex.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6E685F]">
                                  <span className="font-medium text-[#547460]">
                                    {item.sets} set × {item.reps}
                                  </span>
                                  <span>• {ex.equipment}</span>
                                  {lastW && (
                                    <span className="text-[#9A4A3C] font-medium">
                                      • Son: {lastW} kg
                                    </span>
                                  )}
                                </div>
                                {item.note && (
                                  <div className="text-[11px] text-[#6E685F] italic mt-0.5">
                                    İpucu: {item.note}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenExercise(ex)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E2ECE5] text-xs font-semibold text-[#456350] border border-[#EAE2D6] shrink-0 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Nasıl Yapılır?</span>
                              <span className="sm:hidden">İzle</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
