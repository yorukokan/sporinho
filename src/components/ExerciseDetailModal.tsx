import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Link2,
  Play,
  Settings2,
  Sparkles,
  Trash2,
  Wind,
  X,
  Youtube,
} from 'lucide-react';
import { Exercise } from '../types';
import { ExerciseAnimation } from './ExerciseAnimation';
import { MuscleMap } from './MuscleMap';
import { extractYouTubeId } from '../utils/storage';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  customVideoId?: string;
  lastWeight?: string;
  onSaveCustomVideo: (exerciseId: string, videoId: string | null) => void;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  customVideoId,
  lastWeight,
  onSaveCustomVideo,
  onClose,
}) => {
  const [mediaTab, setMediaTab] = useState<'animation' | 'video'>('animation');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

  if (!exercise) return null;

  const ytTrUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exercise.videoSearchTr
  )}`;
  const ytShortsUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exercise.videoSearchShorts
  )}`;
  const ytEnUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exercise.videoSearchEn
  )}`;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(videoUrlInput);
    if (!id) {
      setUrlError('Geçerli bir YouTube bağlantısı veya Shorts linki yapıştırın.');
      return;
    }
    setUrlError('');
    setVideoUrlInput('');
    onSaveCustomVideo(exercise.id, id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2D2A26]/45 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#FAF7F2] border border-[#E6DDD0] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-[#FAF7F2]/95 backdrop-blur-md px-5 pt-5 pb-4 border-b border-[#EAE2D6]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E2ECE5] text-[#456350]">
                {exercise.equipment}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F9E4DF] text-[#9A4A3C]">
                {exercise.difficulty}
              </span>
              {lastWeight && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAE5F5] text-[#5B4D82]">
                  Son ağırlığın: {lastWeight} kg
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2D2A26] leading-tight">
              {exercise.name}
            </h2>
            <p className="text-xs text-[#6E685F] mt-0.5">
              Salondaki adı: <span className="font-medium">{exercise.englishName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E6DDD0] flex items-center justify-center text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F2ECE3] transition shrink-0 cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Media Tabs: Animated Form Coach vs Video Tutorials */}
          <div>
            <div className="inline-flex p-1 rounded-2xl bg-[#EFE8DD] mb-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setMediaTab('animation')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  mediaTab === 'animation'
                    ? 'bg-white text-[#2D2A26] shadow-xs'
                    : 'text-[#6E685F] hover:text-[#2D2A26]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#6B8F78]" />
                Uygulamalı Animasyon
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('video')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  mediaTab === 'video'
                    ? 'bg-white text-[#2D2A26] shadow-xs'
                    : 'text-[#6E685F] hover:text-[#2D2A26]'
                }`}
              >
                <Youtube className="w-4 h-4 text-[#D98A7C]" />
                Uygulamalı Video
                {customVideoId && (
                  <span className="w-2 h-2 rounded-full bg-[#6B8F78]" title="Kayıtlı video var" />
                )}
              </button>
            </div>

            {mediaTab === 'animation' ? (
              <ExerciseAnimation kind={exercise.animationKind} tempo={exercise.tempo} />
            ) : (
              <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4 space-y-4">
                {customVideoId ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#547460] flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5" />
                        Kayıtlı Uygulamalı Videon
                      </span>
                      <button
                        type="button"
                        onClick={() => onSaveCustomVideo(exercise.id, null)}
                        className="text-xs text-[#9A4A3C] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Videoyu Kaldır
                      </button>
                    </div>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#2D2A26]">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${customVideoId}?rel=0`}
                        title={`${exercise.name} video rehberi`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#FDF4F2] border border-[#F0C8BE]/60 p-4">
                    <p className="text-sm font-semibold text-[#2D2A26] mb-1">
                      Gerçek Eğitmen Videolarıyla İzle
                    </p>
                    <p className="text-xs text-[#6E685F] leading-relaxed">
                      Aşağıdaki butonlarla bu hareketin Türkçe kısa anlatımlarını veya detaylı form
                      videolarını YouTube’da anında açabilir, beğendiğin bir videonun linkini aşağıya
                      yapıştırarak uygulama içine sabitleyebilirsin!
                    </p>
                  </div>
                )}

                {/* Curated 1-tap Video Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a
                    href={ytShortsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#FDF4F2] hover:bg-[#F9E4DF] border border-[#F0C8BE]/60 transition group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#9A4A3C]">Kısa Video (Shorts)</div>
                      <div className="text-[11px] text-[#6E685F]">30 sn hızlı form özeti</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#C67162] shrink-0 group-hover:translate-x-0.5 transition" />
                  </a>

                  <a
                    href={ytTrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F2F6F3] hover:bg-[#E2ECE5] border border-[#C5D9CB]/60 transition group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#456350]">Türkçe Detaylı</div>
                      <div className="text-[11px] text-[#6E685F]">Adım adım anlatım</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#547460] shrink-0 group-hover:translate-x-0.5 transition" />
                  </a>

                  <a
                    href={ytEnUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F6F4FA] hover:bg-[#EAE5F5] border border-[#D8CFF0]/60 transition group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#5B4D82]">Global Form Rehberi</div>
                      <div className="text-[11px] text-[#6E685F]">İngilizce video örnekleri</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#7D6CA8] shrink-0 group-hover:translate-x-0.5 transition" />
                  </a>
                </div>

                {/* Custom YouTube Embed Saver */}
                <form onSubmit={handleSaveUrl} className="pt-2 border-t border-[#F2ECE3]">
                  <label className="block text-xs font-semibold text-[#6E685F] mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    Beğendiğin YouTube videosunu bu harekete sabitle (isteğe bağlı)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={videoUrlInput}
                      onChange={(e) => {
                        setVideoUrlInput(e.target.value);
                        setUrlError('');
                      }}
                      placeholder="https://youtube.com/watch?v=... veya Shorts linki"
                      className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] focus:outline-none focus:border-[#6B8F78]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#6B8F78] hover:bg-[#547460] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0"
                    >
                      Kaydet
                    </button>
                  </div>
                  {urlError && <p className="text-xs text-[#C67162] mt-1">{urlError}</p>}
                </form>
              </div>
            )}
          </div>

          {/* Summary & Gym Machine Setup */}
          <div className="rounded-2xl bg-[#F2F6F3] border border-[#D4E3D9] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#456350] mb-1.5">
              <Settings2 className="w-4 h-4" />
              Salonda Kurulum & Başlangıç Pozisyonu
            </div>
            <p className="text-sm text-[#2D2A26] leading-relaxed">{exercise.machineSetup}</p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
            <h3 className="text-sm font-bold text-[#2D2A26] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6B8F78]" />
              Adım Adım Nasıl Yapılır?
            </h3>
            <ol className="space-y-2.5">
              {exercise.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#2D2A26] leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-[#F2ECE3] text-[#547460] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Breathing & Starting Weight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#547460] mb-2">
                <Wind className="w-4 h-4" />
                Nefes Tekniği
              </div>
              <p className="text-xs text-[#2D2A26] mb-1.5">
                <span className="font-semibold text-[#547460]">Nefes Al:</span> {exercise.breathing.inhale}
              </p>
              <p className="text-xs text-[#2D2A26]">
                <span className="font-semibold text-[#C67162]">Nefes Ver:</span> {exercise.breathing.exhale}
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#EAE2D6] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A4A3C] mb-2">
                <Dumbbell className="w-4 h-4" />
                Başlangıç Ağırlığı Önerisi
              </div>
              <p className="text-xs text-[#2D2A26] leading-relaxed">{exercise.beginnerWeight}</p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="rounded-2xl bg-[#FDF4F2] border border-[#F0C8BE]/70 p-4">
            <h3 className="text-sm font-bold text-[#9A4A3C] mb-2.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Dikkat Edilecek Noktalar (Sık Hatalar)
            </h3>
            <div className="space-y-2.5">
              {exercise.mistakes.map((m, idx) => (
                <div key={idx} className="bg-white/80 rounded-xl p-3 text-xs space-y-1">
                  <p className="font-semibold text-[#9A4A3C]">✕ {m.mistake}</p>
                  <p className="text-[#456350]">✓ {m.fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Muscle Map */}
          <MuscleMap primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} />
        </div>
      </div>
    </div>
  );
};
