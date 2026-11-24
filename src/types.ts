export type MuscleId =
  | 'quads'
  | 'glutes'
  | 'hamstrings'
  | 'calves'
  | 'abductors'
  | 'lats'
  | 'upper_back'
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'cardio';

export type BodyCategory = 'Alt Vücut & Kalça' | 'Üst Vücut' | 'Core & Karın' | 'Kardiyo';

export type EquipmentType = 'Makine' | 'Dambıl' | 'Kablo' | 'Vücut Ağırlığı' | 'Kardiyo';

export type AnimationKind =
  | 'leg_press'
  | 'squat'
  | 'rdl'
  | 'hip_thrust'
  | 'leg_extension'
  | 'leg_curl'
  | 'hip_abduction'
  | 'lunge'
  | 'cable_kickback'
  | 'lat_pulldown'
  | 'seated_row'
  | 'face_pull'
  | 'chest_press'
  | 'shoulder_press'
  | 'lateral_raise'
  | 'triceps_pushdown'
  | 'bicep_curl'
  | 'plank'
  | 'dead_bug'
  | 'bird_dog'
  | 'incline_walk';

export interface MistakeFix {
  mistake: string;
  fix: string;
}

export interface Exercise {
  id: string;
  name: string;
  englishName: string;
  category: BodyCategory;
  equipment: EquipmentType;
  difficulty: 'Çok Kolay' | 'Başlangıç' | 'Orta-Başlangıç';
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
  animationKind: AnimationKind;
  shortDesc: string;
  machineSetup: string;
  steps: string[];
  breathing: {
    inhale: string;
    exhale: string;
  };
  tempo: string;
  beginnerWeight: string;
  mistakes: MistakeFix[];
  videoSearchTr: string;
  videoSearchShorts: string;
  videoSearchEn: string;
}

export type DaysPerWeek = 2 | 3 | 4 | 5;

export type GoalFocus = 'balanced' | 'glute_lower' | 'cardio_tone';

export interface WorkoutExercisePlan {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  note?: string;
}

export interface StretchItem {
  name: string;
  duration: string;
  tip: string;
}

export interface WorkoutDayPlan {
  id: string;
  dayIndex: number;
  title: string;
  subtitle: string;
  focusLabel: string;
  estimatedMinutes: number;
  accent: 'sage' | 'rose' | 'lavender';
  warmup: StretchItem[];
  exercises: WorkoutExercisePlan[];
  cooldown: StretchItem[];
}

export interface SetRecord {
  weight: string;
  reps: string;
  completed: boolean;
}

export interface CompletedExerciseLog {
  exerciseId: string;
  sets: SetRecord[];
}

export interface CompletedWorkout {
  id: string;
  dateIso: string;
  workoutDayId: string;
  workoutTitle: string;
  durationMinutes: number;
  totalSets: number;
  exercises: CompletedExerciseLog[];
  feeling: 'harika' | 'iyi' | 'zorlayici';
}

export interface UserState {
  name: string;
  daysPerWeek: DaysPerWeek;
  goalFocus: GoalFocus;
  scheduledWeekdays: number[]; // 0 = Pzt ... 6 = Paz
  completedWorkouts: CompletedWorkout[];
  lastWeights: Record<string, string>; // exerciseId -> weight string
  customVideos: Record<string, string>; // exerciseId -> youtube video ID
  checkedBagItems: string[];
  onboarded: boolean;
}
