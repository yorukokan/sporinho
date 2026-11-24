import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Dumbbell,
  Heart,
  TrendingUp,
} from 'lucide-react';
import {
  CompletedWorkout,
  DaysPerWeek,
  Exercise,
  GoalFocus,
  UserState,
  WorkoutDayPlan,
} from './types';
import { DAYS_GUIDE, generateWeeklyPlan } from './data/programs';
import { loadUserState, saveUserState } from './utils/storage';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { BeginnerGuide } from './components/BeginnerGuide';
import { ProgressView } from './components/ProgressView';
import { WorkoutRunner } from './components/WorkoutRunner';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';

type NavTab = 'plan' | 'library' | 'guide' | 'progress';

export function App() {
  const [user, setUser] = useState<UserState>(() => loadUserState());
  const [activeTab, setActiveTab] = useState<NavTab>('plan');
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<WorkoutDayPlan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    saveUserState(user);
  }, [user]);

  const weeklyPlan = useMemo(
    () => generateWeeklyPlan(user.daysPerWeek, user.goalFocus),
    [user.daysPerWeek, user.goalFocus]
  );

  const handleChangeDays = (days: DaysPerWeek) => {
    setUser((prev) => ({
      ...prev,
      daysPerWeek: days,
      scheduledWeekdays: DAYS_GUIDE[days].recommendedWeekdays,
    }));
  };

  const handleChangeGoal = (goal: GoalFocus) => {
    setUser((prev) => ({ ...prev, goalFocus: goal }));
  };

  const handleToggleWeekday = (weekdayIdx: number) => {
    setUser((prev) => {
      const exists = prev.scheduledWeekdays.includes(weekdayIdx);
      const next = exists
        ? prev.scheduledWeekdays.filter((d) => d !== weekdayIdx)
        : [...prev.scheduledWeekdays, weekdayIdx].sort((a, b) => a - b);
      return { ...prev, scheduledWeekdays: next };
    });
  };

  const handleUpdateName = (name: string) => {
    setUser((prev) => ({ ...prev, name }));
  };

  const handleSaveCustomVideo = (exerciseId: string, videoId: string | null) => {
    setUser((prev) => {
      const nextVideos = { ...prev.customVideos };
      if (videoId) {
        nextVideos[exerciseId] = videoId;
      } else {
        delete nextVideos[exerciseId];
      }
      return { ...prev, customVideos: nextVideos };
    });
  };

  const handleToggleBagItem = (id: string) => {
    setUser((prev) => {
      const exists = prev.checkedBagItems.includes(id);
      return {
        ...prev,
        checkedBagItems: exists
          ? prev.checkedBagItems.filter((i) => i !== id)
          : [...prev.checkedBagItems, id],
      };
    });
  };

  const handleFinishWorkout = (
    workout: CompletedWorkout,
    updatedWeights: Record<string, string>
  ) => {
    setUser((prev) => ({
      ...prev,
      completedWorkouts: [workout, ...prev.completedWorkouts],
      lastWeights: { ...prev.lastWeights, ...updatedWeights },
    }));
    setActiveWorkoutDay(null);
    setActiveTab('plan');
  };

  const handleDeleteWorkout = (id: string) => {
    setUser((prev) => ({
      ...prev,
      completedWorkouts: prev.completedWorkouts.filter((w) => w.id !== id),
    }));
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'plan', label: 'Programım', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'library', label: 'Hareketler', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'guide', label: 'İlk Gün Rehberi', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'progress', label: 'Gelişimim', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE2D6]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveWorkoutDay(null);
              setActiveTab('plan');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#D98A7C] via-[#E19C90] to-[#6B8F78] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <Heart className="w-4.5 h-4.5 fill-white" />
            </div>
            <div className="text-left">
              <div className="font-display text-lg font-bold leading-none text-[#2D2A26] flex items-center gap-1">
                Sporinho
                <span className="text-[#D98A7C] text-sm">♥</span>
              </div>
              <div className="text-[11px] text-[#9A4A3C] font-medium">
                Zeynep Çiğdem İçin Sevgiyle
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          {!activeWorkoutDay && (
            <nav className="hidden md:flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#EAE2D6]">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-[#6B8F78] text-white shadow-2xs'
                        : 'text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-12">
        {activeWorkoutDay ? (
          <WorkoutRunner
            day={activeWorkoutDay}
            lastWeights={user.lastWeights}
            onOpenExercise={(ex) => setSelectedExercise(ex)}
            onFinish={handleFinishWorkout}
            onCancel={() => setActiveWorkoutDay(null)}
          />
        ) : (
          <>
            {activeTab === 'plan' && (
              <WeeklyPlanner
                user={user}
                weeklyPlan={weeklyPlan}
                onChangeDays={handleChangeDays}
                onChangeGoal={handleChangeGoal}
                onToggleWeekday={handleToggleWeekday}
                onUpdateName={handleUpdateName}
                onStartWorkout={(day) => setActiveWorkoutDay(day)}
                onOpenExercise={(ex) => setSelectedExercise(ex)}
              />
            )}

            {activeTab === 'library' && (
              <ExerciseLibrary
                customVideos={user.customVideos}
                lastWeights={user.lastWeights}
                onOpenExercise={(ex) => setSelectedExercise(ex)}
              />
            )}

            {activeTab === 'guide' && (
              <BeginnerGuide
                checkedBagItems={user.checkedBagItems}
                onToggleBagItem={handleToggleBagItem}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressView user={user} onDeleteWorkout={handleDeleteWorkout} />
            )}
          </>
        )}
      </main>

      {/* Subtle Romantic Footer */}
      {!activeWorkoutDay && (
        <footer className="hidden md:block py-5 text-center text-xs text-[#6E685F] border-t border-[#EAE2D6]/70">
          <span className="inline-flex items-center gap-1.5">
            Zeynep Çiğdem için sevgiyle hazırlandı
            <Heart className="w-3.5 h-3.5 text-[#D98A7C] fill-[#D98A7C]" />
            Her adımda seninleyim aşkım
          </span>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {!activeWorkoutDay && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EAE2D6] px-2 py-2">
          <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                    active ? 'bg-[#E2ECE5] text-[#456350]' : 'text-[#6E685F]'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Exercise Detail Modal (Animation + Video + Machine Setup + Mistakes) */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        customVideoId={selectedExercise ? user.customVideos[selectedExercise.id] : undefined}
        lastWeight={selectedExercise ? user.lastWeights[selectedExercise.id] : undefined}
        onSaveCustomVideo={handleSaveCustomVideo}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}

export default App;
