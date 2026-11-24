import { DaysPerWeek, GoalFocus, StretchItem, WorkoutDayPlan } from '../types';

const LOWER_WARMUP: StretchItem[] = [
  {
    name: 'Hafif Yürüyüş veya Bisiklet',
    duration: '4 dk',
    tip: 'Nabzını nazikçe yükselt ve eklemleri ısıt.',
  },
  {
    name: 'Kalça Daireleri & Bacak Sallama',
    duration: '1 dk',
    tip: 'Bir yerden hafif tutunup her bacağı öne-arkaya 10 kez salla.',
  },
  {
    name: 'Ekipmansız Yavaş Squat',
    duration: '10 tekrar',
    tip: 'Ağırlıksız şekilde diz ve kalçalarını harekete hazırla.',
  },
];

const UPPER_WARMUP: StretchItem[] = [
  {
    name: 'Hafif Kardiyo (Eliptik / Yürüyüş)',
    duration: '3 dk',
    tip: 'Vücudun hafifçe ısınınca durabilirsin.',
  },
  {
    name: 'Omuz Çemberleri (Öne & Geriye)',
    duration: '1 dk',
    tip: 'Büyük ve sakin dairelerle omuz eklemlerini rahatlat.',
  },
  {
    name: 'Göğüs Açma & Kürek Kemiği Sıkıştırma',
    duration: '12 tekrar',
    tip: 'Kollarını iki yana açıp kürek kemiklerini birbirine yaklaştır.',
  },
];

const FULL_WARMUP: StretchItem[] = [
  {
    name: 'Hafif Yürüyüş / Eliptik',
    duration: '4 dk',
    tip: 'Sohbet edebileceğin rahat tempoda ısın.',
  },
  {
    name: 'Omuz & Kalça Mobilitesi',
    duration: '2 dk',
    tip: 'Omuz çemberleri, kedi-inek (Cat-Cow) veya nazik gövde dönüşleri.',
  },
  {
    name: 'Vücut Ağırlığı Isınma Tekrarları',
    duration: '8-10 tekrar',
    tip: 'İlk hareketin en hafif ağırlığıyla 1 ısınma seti yap.',
  },
];

const GENERAL_COOLDOWN: StretchItem[] = [
  {
    name: 'Ön & Arka Bacak Esnetme',
    duration: '30 sn / taraf',
    tip: 'Acıtmadan, tatlı bir gerilme hissedene kadar esne.',
  },
  {
    name: 'Çocuk Pozu (Child’s Pose)',
    duration: '45 sn',
    tip: 'Matta kollarını öne uzatıp sırtını ve omuzlarını tamamen serbest bırak.',
  },
  {
    name: 'Derin Diyafram Nefesi',
    duration: '5 nefes',
    tip: '4 sn al, 6 sn ver — bedenine antrenmanın bittiği sinyalini gönder.',
  },
];

export const GOAL_INFO: Record<
  GoalFocus,
  { label: string; shortDesc: string; badge: string }
> = {
  balanced: {
    label: 'Dengeli Başlangıç & Sıkılaşma',
    shortDesc: 'Tüm vücudu yormadan güçlendiren, salona alışmak için en ideal denge.',
    badge: 'Önerilen',
  },
  glute_lower: {
    label: 'Alt Vücut & Kalça Odaklı',
    shortDesc: 'Kalça, bacak ve core öncelikli; duruşu destekleyen üst vücut dengeli.',
    badge: 'Popüler',
  },
  cardio_tone: {
    label: 'Kondisyon & Enerji',
    shortDesc: 'Temel kuvvet hareketlerine ek olarak keyifli eğimli yürüyüş desteği.',
    badge: 'Zinde',
  },
};

export const DAYS_GUIDE: Record<
  DaysPerWeek,
  { splitName: string; summary: string; recommendedWeekdays: number[] }
> = {
  2: {
    splitName: '2 Gün Tüm Vücut (Full Body A & B)',
    summary:
      'Yoğun haftalar veya ilk ay için harika! Her gün tüm vücut çalışır, aralarda bol dinlenme kalır.',
    recommendedWeekdays: [1, 4], // Salı, Cuma
  },
  3: {
    splitName: '3 Gün Dengeli Tüm Vücut',
    summary:
      'Yeni başlayanlar için altın standart: haftada 3 gün, 40-45 dakikalık ferah antrenmanlar.',
    recommendedWeekdays: [0, 2, 4], // Pzt, Çar, Cum
  },
  4: {
    splitName: '4 Gün Alt / Üst Vücut (Upper-Lower)',
    summary:
      '2 gün alt vücut & kalça, 2 gün üst vücut & core. Kaslar dinlenirken sen ritmini korursun.',
    recommendedWeekdays: [0, 1, 3, 5], // Pzt, Sal, Per, Cmt
  },
  5: {
    splitName: '5 Gün Akıllı Bölünmüş Program',
    summary:
      'Alt vücut, üst vücut ve aktif toparlanma (core + yürüyüş) dengesiyle yormadan ilerleme.',
    recommendedWeekdays: [0, 1, 2, 4, 5], // Pzt, Sal, Çar, Cum, Cmt
  },
};

export function generateWeeklyPlan(
  days: DaysPerWeek,
  goal: GoalFocus
): WorkoutDayPlan[] {
  const repRange = goal === 'cardio_tone' ? '12-15 tekrar' : '10-12 tekrar';
  const restBase = goal === 'cardio_tone' ? 60 : 75;
  const addCardioFinisher = (list: WorkoutDayPlan['exercises']) => {
    if (goal === 'cardio_tone') {
      return [
        ...list,
        {
          exerciseId: 'incline-walk',
          sets: 1,
          reps: '15 dk',
          restSeconds: 30,
          note: 'Eğim %6-8, rahat konuşabileceğin tempo',
        },
      ];
    }
    return list;
  };

  if (days === 2) {
    return [
      {
        id: '2d-day-1',
        dayIndex: 1,
        title: '1. Gün — Tüm Vücut A',
        subtitle: 'Bacak, sırt ve merkez bölge temeli',
        focusLabel: 'Tüm Vücut',
        estimatedMinutes: goal === 'cardio_tone' ? 50 : 40,
        accent: 'sage',
        warmup: FULL_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'leg-press', sets: 3, reps: repRange, restSeconds: restBase, note: 'İlk set hafif ağırlıkla ısınma' },
          { exerciseId: 'lat-pulldown', sets: 3, reps: repRange, restSeconds: restBase },
          {
            exerciseId: goal === 'glute_lower' ? 'hip-thrust' : 'dumbbell-rdl',
            sets: 3,
            reps: repRange,
            restSeconds: restBase,
          },
          { exerciseId: 'chest-press', sets: 3, reps: repRange, restSeconds: 60 },
          { exerciseId: 'hip-abduction', sets: 2, reps: '15 tekrar', restSeconds: 60 },
          { exerciseId: 'dead-bug', sets: 2, reps: '10 / taraf', restSeconds: 45 },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
      {
        id: '2d-day-2',
        dayIndex: 2,
        title: '2. Gün — Tüm Vücut B',
        subtitle: 'Kalça, duruş, omuz ve core dengesi',
        focusLabel: 'Tüm Vücut',
        estimatedMinutes: goal === 'cardio_tone' ? 50 : 40,
        accent: 'rose',
        warmup: FULL_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'goblet-squat', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'seated-cable-row', sets: 3, reps: repRange, restSeconds: restBase },
          {
            exerciseId: goal === 'glute_lower' ? 'dumbbell-rdl' : 'hip-thrust',
            sets: 3,
            reps: repRange,
            restSeconds: restBase,
          },
          { exerciseId: 'shoulder-press', sets: 3, reps: repRange, restSeconds: 60 },
          { exerciseId: 'triceps-pushdown', sets: 2, reps: '12 tekrar', restSeconds: 60 },
          { exerciseId: 'plank', sets: 2, reps: '25-35 sn', restSeconds: 45 },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
    ];
  }

  if (days === 3) {
    return [
      {
        id: '3d-day-1',
        dayIndex: 1,
        title: '1. Gün — Alt Vücut & Kalça',
        subtitle: 'Bacak ve kalçaya nazik, güçlü başlangıç',
        focusLabel: 'Alt Vücut',
        estimatedMinutes: goal === 'cardio_tone' ? 50 : 40,
        accent: 'rose',
        warmup: LOWER_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'leg-press', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'hip-thrust', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'seated-leg-curl', sets: 3, reps: '12 tekrar', restSeconds: 60 },
          { exerciseId: 'hip-abduction', sets: 3, reps: '15 tekrar', restSeconds: 60 },
          { exerciseId: 'dead-bug', sets: 2, reps: '10 / taraf', restSeconds: 45 },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
      {
        id: '3d-day-2',
        dayIndex: 2,
        title: '2. Gün — Üst Vücut & Duruş',
        subtitle: 'Sırt, omuz ve kolları zarifçe güçlendir',
        focusLabel: 'Üst Vücut',
        estimatedMinutes: goal === 'cardio_tone' ? 50 : 38,
        accent: 'sage',
        warmup: UPPER_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'lat-pulldown', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'chest-press', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'seated-cable-row', sets: 3, reps: repRange, restSeconds: 60 },
          { exerciseId: 'lateral-raise', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
          { exerciseId: 'triceps-pushdown', sets: 2, reps: '12 tekrar', restSeconds: 60 },
          { exerciseId: 'bird-dog', sets: 2, reps: '10 / taraf', restSeconds: 45 },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
      {
        id: '3d-day-3',
        dayIndex: 3,
        title: '3. Gün — Tüm Vücut & Glute',
        subtitle: 'Haftayı dengeli ve enerjik kapat',
        focusLabel: goal === 'glute_lower' ? 'Kalça + Tüm Vücut' : 'Tüm Vücut',
        estimatedMinutes: goal === 'cardio_tone' ? 52 : 42,
        accent: 'lavender',
        warmup: FULL_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'goblet-squat', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'dumbbell-rdl', sets: 3, reps: repRange, restSeconds: restBase },
          {
            exerciseId: goal === 'glute_lower' ? 'cable-kickback' : 'shoulder-press',
            sets: 3,
            reps: '12 tekrar',
            restSeconds: 60,
          },
          { exerciseId: 'face-pull', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
          { exerciseId: 'leg-extension', sets: 2, reps: '12-15 tekrar', restSeconds: 60 },
          { exerciseId: 'plank', sets: 2, reps: '30 sn', restSeconds: 45 },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
    ];
  }

  if (days === 4) {
    return [
      {
        id: '4d-day-1',
        dayIndex: 1,
        title: '1. Gün — Alt Vücut (Ön Bacak & Kalça)',
        subtitle: 'Güvenli makineler ve temel squat formu',
        focusLabel: 'Alt Vücut A',
        estimatedMinutes: goal === 'cardio_tone' ? 50 : 40,
        accent: 'rose',
        warmup: LOWER_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'leg-press', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'goblet-squat', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'leg-extension', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
          { exerciseId: 'hip-abduction', sets: 3, reps: '15 tekrar', restSeconds: 60 },
          { exerciseId: 'dead-bug', sets: 3, reps: '10 / taraf', restSeconds: 45 },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
      {
        id: '4d-day-2',
        dayIndex: 2,
        title: '2. Gün — Üst Vücut (Sırt & Omuz)',
        subtitle: 'Dik duruş ve dengeli üst vücut',
        focusLabel: 'Üst Vücut A',
        estimatedMinutes: 38,
        accent: 'sage',
        warmup: UPPER_WARMUP,
        exercises: [
          { exerciseId: 'lat-pulldown', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'seated-cable-row', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'shoulder-press', sets: 3, reps: repRange, restSeconds: 60 },
          { exerciseId: 'face-pull', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
          { exerciseId: 'bicep-curl', sets: 2, reps: '12 tekrar', restSeconds: 60 },
        ],
        cooldown: GENERAL_COOLDOWN,
      },
      {
        id: '4d-day-3',
        dayIndex: 3,
        title: '3. Gün — Alt Vücut (Kalça & Arka Bacak)',
        subtitle: 'Glute ve arka bacak odaklı akış',
        focusLabel: 'Alt Vücut B',
        estimatedMinutes: goal === 'cardio_tone' ? 50 : 40,
        accent: 'rose',
        warmup: LOWER_WARMUP,
        exercises: addCardioFinisher([
          { exerciseId: 'hip-thrust', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'dumbbell-rdl', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'seated-leg-curl', sets: 3, reps: '12 tekrar', restSeconds: 60 },
          { exerciseId: 'cable-kickback', sets: 3, reps: '12 / bacak', restSeconds: 60 },
          { exerciseId: 'reverse-lunge', sets: 2, reps: '8 / bacak', restSeconds: 60, note: 'İlk hafta ağırlıksız' },
        ]),
        cooldown: GENERAL_COOLDOWN,
      },
      {
        id: '4d-day-4',
        dayIndex: 4,
        title: '4. Gün — Üst Vücut & Core',
        subtitle: 'Göğüs, omuz, arka kol ve merkez güç',
        focusLabel: 'Üst Vücut B',
        estimatedMinutes: 40,
        accent: 'lavender',
        warmup: UPPER_WARMUP,
        exercises: [
          { exerciseId: 'chest-press', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'lat-pulldown', sets: 3, reps: repRange, restSeconds: restBase },
          { exerciseId: 'lateral-raise', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
          { exerciseId: 'triceps-pushdown', sets: 3, reps: '12 tekrar', restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, reps: '25-35 sn', restSeconds: 45 },
          ...(goal === 'cardio_tone'
            ? [{ exerciseId: 'incline-walk', sets: 1, reps: '15 dk', restSeconds: 30 }]
            : []),
        ],
        cooldown: GENERAL_COOLDOWN,
      },
    ];
  }

  // 5 Days
  return [
    {
      id: '5d-day-1',
      dayIndex: 1,
      title: '1. Gün — Alt Vücut (Kalça Odak)',
      subtitle: 'Haftaya güçlü ve odaklı bir glute akışıyla başla',
      focusLabel: 'Kalça & Arka Bacak',
      estimatedMinutes: 40,
      accent: 'rose',
      warmup: LOWER_WARMUP,
      exercises: [
        { exerciseId: 'hip-thrust', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'dumbbell-rdl', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'hip-abduction', sets: 3, reps: '15 tekrar', restSeconds: 60 },
        { exerciseId: 'cable-kickback', sets: 3, reps: '12 / bacak', restSeconds: 60 },
      ],
      cooldown: GENERAL_COOLDOWN,
    },
    {
      id: '5d-day-2',
      dayIndex: 2,
      title: '2. Gün — Üst Vücut (Çekiş & Duruş)',
      subtitle: 'Sırt, arka omuz ve ön kol',
      focusLabel: 'Sırt & Duruş',
      estimatedMinutes: 35,
      accent: 'sage',
      warmup: UPPER_WARMUP,
      exercises: [
        { exerciseId: 'lat-pulldown', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'seated-cable-row', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'face-pull', sets: 3, reps: '15 tekrar', restSeconds: 60 },
        { exerciseId: 'bicep-curl', sets: 3, reps: '12 tekrar', restSeconds: 60 },
      ],
      cooldown: GENERAL_COOLDOWN,
    },
    {
      id: '5d-day-3',
      dayIndex: 3,
      title: '3. Gün — Core & Hafif Kardiyo',
      subtitle: 'Kasları yormadan aktif toparlanma ve enerji günü',
      focusLabel: 'Core & Kardiyo',
      estimatedMinutes: 35,
      accent: 'lavender',
      warmup: FULL_WARMUP,
      exercises: [
        { exerciseId: 'dead-bug', sets: 3, reps: '10 / taraf', restSeconds: 45 },
        { exerciseId: 'bird-dog', sets: 3, reps: '10 / taraf', restSeconds: 45 },
        { exerciseId: 'plank', sets: 3, reps: '30 sn', restSeconds: 45 },
        {
          exerciseId: 'incline-walk',
          sets: 1,
          reps: '20 dk',
          restSeconds: 30,
          note: 'Eğim %7-9, sevdiğin podcast veya müzik eşliğinde!',
        },
      ],
      cooldown: GENERAL_COOLDOWN,
    },
    {
      id: '5d-day-4',
      dayIndex: 4,
      title: '4. Gün — Alt Vücut (Ön & Arka Bacak)',
      subtitle: 'Bacakları dengeli güçlendiren makine & dambıl akışı',
      focusLabel: 'Bacak & Kalça',
      estimatedMinutes: 40,
      accent: 'rose',
      warmup: LOWER_WARMUP,
      exercises: [
        { exerciseId: 'leg-press', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'goblet-squat', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'leg-extension', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
        { exerciseId: 'seated-leg-curl', sets: 3, reps: '12 tekrar', restSeconds: 60 },
        { exerciseId: 'reverse-lunge', sets: 2, reps: '8 / bacak', restSeconds: 60 },
      ],
      cooldown: GENERAL_COOLDOWN,
    },
    {
      id: '5d-day-5',
      dayIndex: 5,
      title: '5. Gün — Üst Vücut (İtiş & Omuz)',
      subtitle: 'Göğüs, omuz ve arka kol ile ferah kapanış',
      focusLabel: 'Omuz & Kol',
      estimatedMinutes: 35,
      accent: 'sage',
      warmup: UPPER_WARMUP,
      exercises: [
        { exerciseId: 'chest-press', sets: 3, reps: repRange, restSeconds: restBase },
        { exerciseId: 'shoulder-press', sets: 3, reps: repRange, restSeconds: 60 },
        { exerciseId: 'lateral-raise', sets: 3, reps: '12-15 tekrar', restSeconds: 60 },
        { exerciseId: 'triceps-pushdown', sets: 3, reps: '12 tekrar', restSeconds: 60 },
        ...(goal === 'cardio_tone'
          ? [{ exerciseId: 'incline-walk', sets: 1, reps: '12 dk', restSeconds: 30 }]
          : []),
      ],
      cooldown: GENERAL_COOLDOWN,
    },
  ];
}
