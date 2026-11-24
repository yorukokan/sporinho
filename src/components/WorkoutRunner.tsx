import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  Minus,
  Plus,
  SkipForward,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  CompletedExerciseLog,
  CompletedWorkout,
  Exercise,
  SetRecord,
  WorkoutDayPlan,
} from '../types';
import { EXERCISE_MAP } from '../data/exercises';
import { playSoftChime } from '../utils/storage';

interface WorkoutRunnerProps {
  day: WorkoutDayPlan;
  lastWeights: Record<string, string>;
  onOpenExercise: (exercise: Exercise) => void;
  onFinish: (workout: CompletedWorkout, updatedWeights: Record<string, string>) => void;
  onCancel: () => void;
}

export const WorkoutRunner: React.FC<WorkoutRunnerProps> = ({
  day,
  lastWeights,
  onOpenExercise,
  onFinish,
  onCancel,
}) => {
  const [phase, setPhase] = useState<'warmup' | 'main' | 'cooldown' | 'done'>('warmup');
  const [checkedWarmups, setCheckedWarmups] = useState<number[]>([]);
  const [checkedCooldowns, setCheckedCooldowns] = useState<number[]>([]);
  const [startedAt] = useState<number>(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest timer state
  const [restRemaining, setRestRemaining] = useState<number>(0);
  const [restTotal, setRestTotal] = useState<number>(60);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Feeling at finish
  const [feeling, setFeeling] = useState<'harika' | 'iyi' | 'zorlayici'>('harika');

  // Set records per exercise
  const [logs, setLogs] = useState<Record<string, SetRecord[]>>(() => {
    const initial: Record<string, SetRecord[]> = {};
    day.exercises.forEach((item) => {
      const defaultWeight = lastWeights[item.exerciseId] || '';
      initial[item.exerciseId] = Array.from({ length: item.sets }, () => ({
        weight: defaultWeight,
        reps: item.reps.replace(' tekrar', ''),
        completed: false,
      }));
    });
    return initial;
  });

  // Session elapsed timer
  useEffect(() => {
    if (phase === 'done') return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, phase]);

  // Rest countdown timer
  useEffect(() => {
    if (restRemaining <= 0) return;
    const timer = setInterval(() => {
      setRestRemaining((prev) => {
        if (prev <= 1) {
          if (soundOn) playSoftChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [restRemaining, soundOn]);

  const startRest = (seconds: number) => {
    setRestTotal(seconds);
    setRestRemaining(seconds);
  };

  const toggleSetComplete = (exerciseId: string, setIdx: number, restSeconds: number) => {
    setLogs((prev) => {
      const current = [...(prev[exerciseId] || [])];
      const nextCompleted = !current[setIdx].completed;
      current[setIdx] = { ...current[setIdx], completed: nextCompleted };
      if (nextCompleted) {
        startRest(restSeconds);
      }
      return { ...prev, [exerciseId]: current };
    });
  };

  const updateSetField = (
    exerciseId: string,
    setIdx: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    setLogs((prev) => {
      const current = [...(prev[exerciseId] || [])];
      current[setIdx] = { ...current[setIdx], [field]: value };
      return { ...prev, [exerciseId]: current };
    });
  };

  const totalSetsCount = day.exercises.reduce((sum, e) => sum + e.sets, 0);
  const completedSetsCount = Object.values(logs).reduce(
    (sum, sets) => sum + sets.filter((s) => s.completed).length,
    0
  );

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveAndComplete = () => {
    const updatedWeights: Record<string, string> = {};
    const exerciseLogs: CompletedExerciseLog[] = day.exercises.map((item) => {
      const sets = logs[item.exerciseId] || [];
      const lastNonEmptyWeight = [...sets]
        .reverse()
        .find((s) => s.weight.trim() !== '')?.weight;
      if (lastNonEmptyWeight) {
        updatedWeights[item.exerciseId] = lastNonEmptyWeight.trim();
      }
      return {
        exerciseId: item.exerciseId,
        sets,
      };
    });

    const record: CompletedWorkout = {
      id: `w-${Date.now()}`,
      dateIso: new Date().toISOString(),
      workoutDayId: day.id,
      workoutTitle: day.title,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      totalSets: completedSetsCount,
      exercises: exerciseLogs,
      feeling,
    };

    onFinish(record, updatedWeights);
  };

  if (phase === 'done') {
    const floatingHearts = [
      { left: '12%', delay: '0s', size: 'w-5 h-5' },
      { left: '26%', delay: '0.7s', size: 'w-4 h-4' },
      { left: '50%', delay: '0.3s', size: 'w-6 h-6' },
      { left: '72%', delay: '1.1s', size: 'w-4 h-4' },
      { left: '86%', delay: '0.5s', size: 'w-5 h-5' },
    ];
    return (
      <div className="relative overflow-hidden max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-[#FDF4F2] via-white to-[#FAF7F2] border border-[#F0C8BE] p-6 sm:p-8 text-center space-y-6 shadow-md">
        {/* Floating pastel hearts celebration */}
        <div className="pointer-events-none absolute inset-x-0 bottom-16 h-36 overflow-hidden">
          {floatingHearts.map((h, i) => (
            <Heart
              key={i}
              style={{ left: h.left, animationDelay: h.delay }}
              className={`${h.size} absolute bottom-0 text-[#D98A7C] fill-[#D98A7C]/70 animate-heart-float`}
            />
          ))}
        </div>

        <div className="relative w-18 h-18 rounded-full bg-[#F9E4DF] text-[#C67162] flex items-center justify-center mx-auto shadow-xs">
          <Heart className="w-9 h-9 fill-[#D98A7C] text-[#D98A7C] animate-gentle-beat" />
        </div>

        <div className="relative space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#F0C8BE] text-xs font-semibold text-[#9A4A3C]">
            Antrenman Tamamlandı ♥
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Harikasın Zeynep Çiğdem! Seninle Çok Gurur Duyuyorum ♥
          </h2>
          <p className="text-sm text-[#6E685F] leading-relaxed">
            Kendine vakit ayırdığın için tebrikler birtanem. Bol su içmeyi unutma, her antrenman
            bir öncekinden daha kolay ve keyifli olacak!
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3 bg-white/90 rounded-2xl p-4 border border-[#EAE2D6]">
          <div>
            <div className="text-xs text-[#6E685F]">Süre</div>
            <div className="text-lg font-bold text-[#2D2A26]">
              {Math.max(1, Math.round(elapsedSeconds / 60))} dk
            </div>
          </div>
          <div>
            <div className="text-xs text-[#6E685F]">Tamamlanan Set</div>
            <div className="text-lg font-bold text-[#547460]">
              {completedSetsCount}/{totalSetsCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#6E685F]">Hareket</div>
            <div className="text-lg font-bold text-[#C67162]">{day.exercises.length}</div>
          </div>
        </div>

        <div className="relative space-y-2">
          <div className="text-xs font-semibold text-[#6E685F]">
            Bu antrenman nasıl hissettirdi aşkım?
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'harika', label: 'Harika & Enerjik ♥' },
                { id: 'iyi', label: 'Dengeli & İyi' },
                { id: 'zorlayici', label: 'Zorladı ama Yaptım' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFeeling(opt.id)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  feeling === opt.id
                    ? 'bg-[#D98A7C] border-[#D98A7C] text-white shadow-xs'
                    : 'bg-white border-[#EAE2D6] text-[#2D2A26]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAndComplete}
          className="relative w-full py-3.5 rounded-2xl bg-[#D98A7C] hover:bg-[#C67162] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
        >
          Kaydet ve Ana Sayfaya Dön ♥
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      {/* Top Bar */}
      <div className="rounded-3xl bg-white border border-[#EAE2D6] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 sticky top-3 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE3] border border-[#EAE2D6] flex items-center justify-center text-[#2D2A26] cursor-pointer"
            title="Geri dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2D2A26] leading-tight">
              {day.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#6E685F] mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#6B8F78]" />
                {formatTimer(elapsedSeconds)}
              </span>
              <span>
                Setler: <strong className="text-[#2D2A26]">{completedSetsCount}/{totalSetsCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Phase pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-2xl border border-[#EAE2D6]">
          {(
            [
              { id: 'warmup', label: '1. Isınma' },
              { id: 'main', label: '2. Hareketler' },
              { id: 'cooldown', label: '3. Soğuma' },
            ] as const
          ).map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setPhase(step.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                phase === step.id
                  ? 'bg-[#6B8F78] text-white'
                  : 'text-[#6E685F] hover:text-[#2D2A26]'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* WARMUP PHASE */}
      {phase === 'warmup' && (
        <div className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#547460]">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-bold text-[#2D2A26]">
              Başlamadan Önce 5 Dakika Isınma
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6E685F]">
            Eklemlerini ve kaslarını nazikçe ısıtmak hem sakatlanmayı önler hem de hareketleri çok
            daha rahat yapmanı sağlar.
          </p>

          <div className="space-y-2.5">
            {day.warmup.map((w, idx) => {
              const checked = checkedWarmups.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setCheckedWarmups((prev) =>
                      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                    )
                  }
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                    checked
                      ? 'bg-[#F2F6F3] border-[#87A892]'
                      : 'bg-[#FAF7F2] border-[#EAE2D6] hover:border-[#C5D9CB]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      checked
                        ? 'bg-[#6B8F78] border-[#6B8F78] text-white'
                        : 'border-[#C4B7A6] bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          checked ? 'line-through text-[#6E685F]' : 'text-[#2D2A26]'
                        }`}
                      >
                        {w.name}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#547460]">
                        {w.duration}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E685F] mt-1">{w.tip}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPhase('main')}
            className="w-full py-3.5 rounded-2xl bg-[#6B8F78] hover:bg-[#547460] text-white font-semibold text-sm transition cursor-pointer"
          >
            Hazırım, Ana Hareketlere Geç →
          </button>
        </div>
      )}

      {/* MAIN WORKOUT PHASE */}
      {phase === 'main' && (
        <div className="space-y-4">
          {day.exercises.map((item, idx) => {
            const ex = EXERCISE_MAP[item.exerciseId];
            if (!ex) return null;
            const sets = logs[item.exerciseId] || [];
            const allDone = sets.every((s) => s.completed);

            return (
              <div
                key={`${item.exerciseId}-${idx}`}
                className={`rounded-3xl bg-white border p-4 sm:p-5 space-y-4 transition ${
                  allDone ? 'border-[#87A892] bg-[#F9FBF9]' : 'border-[#EAE2D6]'
                }`}
              >
                {/* Exercise header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFE8DD] text-[#2D2A26]">
                        Hareket {idx + 1}
                      </span>
                      <span className="text-xs text-[#6E685F]">
                        Hedef: {item.sets} set × {item.reps}
                      </span>
                      {allDone && (
                        <span className="text-xs font-semibold text-[#547460] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Tamam
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#2D2A26]">{ex.name}</h3>
                    <p className="text-xs text-[#6E685F] mt-0.5">
                      {ex.englishName} • Dinlenme: {item.restSeconds} sn
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenExercise(ex)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FDF4F2] hover:bg-[#F9E4DF] text-xs font-semibold text-[#9A4A3C] border border-[#F0C8BE]/70 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Form & Video İzle
                  </button>
                </div>

                {/* Quick beginner weight hint */}
                <div className="text-xs text-[#547460] bg-[#F2F6F3] rounded-xl px-3 py-2">
                  <span className="font-semibold">Ağırlık ipucu:</span>{' '}
                  {lastWeights[ex.id]
                    ? `Geçen antrenmanda ${lastWeights[ex.id]} kg kullandın. Rahat hissettiysen aynı kal veya az artır!`
                    : ex.beginnerWeight}
                </div>

                {/* Sets table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#6E685F] px-2">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Ağırlık (kg)</div>
                    <div className="col-span-4">Tekrar / Süre</div>
                    <div className="col-span-2 text-right">Bitti</div>
                  </div>

                  {sets.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border transition ${
                        s.completed
                          ? 'bg-[#E2ECE5]/60 border-[#C5D9CB]'
                          : 'bg-[#FAF7F2] border-[#EAE2D6]'
                      }`}
                    >
                      <div className="col-span-2 text-xs font-bold text-[#2D2A26] pl-1">
                        Set {sIdx + 1}
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={s.weight}
                          onChange={(e) =>
                            updateSetField(item.exerciseId, sIdx, 'weight', e.target.value)
                          }
                          placeholder={ex.equipment === 'Vücut Ağırlığı' ? 'Vücut' : 'kg'}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#E6DDD0] text-sm text-[#2D2A26] focus:outline-none focus:border-[#6B8F78]"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={s.reps}
                          onChange={(e) =>
                            updateSetField(item.exerciseId, sIdx, 'reps', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#E6DDD0] text-sm text-[#2D2A26] focus:outline-none focus:border-[#6B8F78]"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleSetComplete(item.exerciseId, sIdx, item.restSeconds)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                            s.completed
                              ? 'bg-[#6B8F78] text-white shadow-xs'
                              : 'bg-white border border-[#D5CCC0] text-[#6E685F] hover:border-[#6B8F78]'
                          }`}
                          aria-label={`Set ${sIdx + 1} tamamla`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setPhase('cooldown')}
            className="w-full py-3.5 rounded-2xl bg-[#D98A7C] hover:bg-[#C67162] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
          >
            Harika! Soğuma ve Esnemeye Geç →
          </button>
        </div>
      )}

      {/* COOLDOWN PHASE */}
      {phase === 'cooldown' && (
        <div className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-4">
          <h3 className="text-lg font-bold text-[#2D2A26]">
            Son Adım: 3 Dakika Rahatlama & Esneme
          </h3>
          <p className="text-xs sm:text-sm text-[#6E685F]">
            Kas ağrısını azaltmak ve bedenini sakinleştirmek için birkaç nazik esneme ile bitirelim.
          </p>

          <div className="space-y-2.5">
            {day.cooldown.map((c, idx) => {
              const checked = checkedCooldowns.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setCheckedCooldowns((prev) =>
                      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                    )
                  }
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                    checked
                      ? 'bg-[#F2F6F3] border-[#87A892]'
                      : 'bg-[#FAF7F2] border-[#EAE2D6]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      checked
                        ? 'bg-[#6B8F78] border-[#6B8F78] text-white'
                        : 'border-[#C4B7A6] bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#2D2A26]">{c.name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#547460]">
                        {c.duration}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E685F] mt-1">{c.tip}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPhase('done')}
            className="w-full py-3.5 rounded-2xl bg-[#6B8F78] hover:bg-[#547460] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
          >
            Antrenmanı Tamamla
          </button>
        </div>
      )}

      {/* Floating Rest Timer Bar */}
      {restRemaining > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-30 rounded-2xl bg-[#2D2A26] text-white p-3.5 shadow-xl border border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6B8F78] flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-white/70 font-medium">Dinlenme Süresi</div>
                <div className="text-xl font-bold tabular-nums leading-tight">
                  {formatTimer(restRemaining)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRestRemaining((r) => Math.max(0, r - 15))}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <Minus className="w-3 h-3" />
                15s
              </button>
              <button
                type="button"
                onClick={() => {
                  setRestRemaining((r) => r + 15);
                  setRestTotal((t) => Math.max(t, restRemaining + 15));
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                15s
              </button>
              <button
                type="button"
                onClick={() => setSoundOn((s) => !s)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
                title={soundOn ? 'Sesi kapat' : 'Sesi aç'}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setRestRemaining(0)}
                className="px-3 py-1.5 rounded-xl bg-[#D98A7C] hover:bg-[#C67162] text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Atla
              </button>
            </div>
          </div>

          {/* Progress strip */}
          <div className="w-full h-1 bg-white/15 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-[#87A892] transition-all duration-1000"
              style={{ width: `${Math.min(100, (restRemaining / Math.max(1, restTotal)) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
