import { UserState } from '../types';
import { DAYS_GUIDE } from '../data/programs';

const STORAGE_KEY = 'sporinho_state_v1';

export const DEFAULT_USER_STATE: UserState = {
  name: 'Zeynep Çiğdem',
  daysPerWeek: 3,
  goalFocus: 'balanced',
  scheduledWeekdays: DAYS_GUIDE[3].recommendedWeekdays,
  completedWorkouts: [],
  lastWeights: {},
  customVideos: {},
  checkedBagItems: ['water', 'towel'],
  onboarded: false,
};

export function loadUserState(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_STATE;
    const parsed = JSON.parse(raw) as Partial<UserState>;
    return {
      ...DEFAULT_USER_STATE,
      ...parsed,
      name: parsed.name?.trim() ? parsed.name : DEFAULT_USER_STATE.name,
      lastWeights: { ...DEFAULT_USER_STATE.lastWeights, ...(parsed.lastWeights || {}) },
      customVideos: { ...DEFAULT_USER_STATE.customVideos, ...(parsed.customVideos || {}) },
      completedWorkouts: Array.isArray(parsed.completedWorkouts) ? parsed.completedWorkouts : [],
      checkedBagItems: Array.isArray(parsed.checkedBagItems)
        ? parsed.checkedBagItems
        : DEFAULT_USER_STATE.checkedBagItems,
      scheduledWeekdays: Array.isArray(parsed.scheduledWeekdays)
        ? parsed.scheduledWeekdays
        : DEFAULT_USER_STATE.scheduledWeekdays,
    };
  } catch {
    return DEFAULT_USER_STATE;
  }
}

export function saveUserState(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '').split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const markerIdx = parts.findIndex((p) => p === 'shorts' || p === 'embed' || p === 'live');
      if (markerIdx !== -1 && parts[markerIdx + 1]) {
        const id = parts[markerIdx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function getStartOfWeekIso(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function countThisWeekWorkouts(completedWorkouts: UserState['completedWorkouts']): number {
  const startOfWeek = new Date(getStartOfWeekIso()).getTime();
  return completedWorkouts.filter((w) => new Date(w.dateIso).getTime() >= startOfWeek).length;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });
}

export function playSoftChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5 warm chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.09 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.5);
    });
  } catch {
    // ignore if audio blocked
  }
}
