import React, { useState } from 'react';
import {
  Backpack,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  HelpCircle,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { BEGINNER_FAQS, BEGINNER_TIPS, GYM_BAG_ITEMS } from '../data/beginnerGuide';

interface BeginnerGuideProps {
  checkedBagItems: string[];
  onToggleBagItem: (id: string) => void;
}

export const BeginnerGuide: React.FC<BeginnerGuideProps> = ({
  checkedBagItems,
  onToggleBagItem,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const accentCard = {
    sage: 'bg-[#F2F6F3] border-[#D4E3D9] text-[#456350]',
    rose: 'bg-[#FDF4F2] border-[#F0C8BE] text-[#9A4A3C]',
    lavender: 'bg-[#F6F4FA] border-[#DCD4EE] text-[#5B4D82]',
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#F2F6F3] via-[#FAF7F2] to-[#F6F4FA] border border-[#E6DDD0] p-5 sm:p-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#547460] border border-[#EAE2D6] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D98A7C]" />
          İlk Gün Özgüven Rehberi
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
          Spora Yeni Başlayanlar İçin Her Şey
        </h1>
        <p className="text-sm text-[#6E685F] mt-1 max-w-2xl leading-relaxed">
          İlk kez spor salonuna adım atarken aklında soru işaretleri olması çok normal. Burada
          çantanı hazırlamaktan doğru ağırlık seçimine kadar ihtiyacın olan her şeyi sade ve samimi
          bir dille derledik.
        </p>
      </div>

      {/* Phone Home Screen PWA Install Guide */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FDF4F2] to-[#FAF7F2] border border-[#F0C8BE]/80 p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#F0C8BE]/70 text-[#D98A7C] flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2D2A26] flex items-center gap-1.5">
              Telefonuna Uygulama Gibi Ekle
              <Heart className="w-4 h-4 text-[#D98A7C] fill-[#D98A7C]" />
            </h2>
            <p className="text-xs text-[#6E685F]">
              Salonda tek dokunuşla açmak için Sporinho’yu ana ekranına sabitleyebilirsin
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#2D2A26]">
          <div className="rounded-2xl bg-white/90 border border-[#EAE2D6] p-3.5 space-y-1">
            <div className="font-bold text-[#9A4A3C]">iPhone (Safari)</div>
            <p className="text-[#6E685F] leading-relaxed">
              Alt ortadaki <strong>Paylaş</strong> butonuna dokun → Aşağı kaydırıp{' '}
              <strong>“Ana Ekrana Ekle”</strong> seçeneğine bas → Kalpli ikonun ana ekranında hazır!
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 border border-[#EAE2D6] p-3.5 space-y-1">
            <div className="font-bold text-[#547460]">Android (Chrome)</div>
            <p className="text-[#6E685F] leading-relaxed">
              Sağ üstteki <strong>⋮ Menü</strong> butonuna dokun →{' '}
              <strong>“Ana ekrana ekle / Uygulamayı yükle”</strong> seçeneğine bas → Bitti!
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Gym Bag Checklist */}
      <section className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F9E4DF] text-[#9A4A3C] flex items-center justify-center">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D2A26]">Spor Çantası Kontrol Listesi</h2>
              <p className="text-xs text-[#6E685F]">Evden çıkmadan önce işaretleyebilirsin</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2ECE5] text-[#456350]">
            {checkedBagItems.length} / {GYM_BAG_ITEMS.length} hazır
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {GYM_BAG_ITEMS.map((item) => {
            const checked = checkedBagItems.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleBagItem(item.id)}
                className={`text-left p-3.5 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  checked
                    ? 'bg-[#F2F6F3] border-[#87A892]'
                    : 'bg-[#FAF7F2] border-[#EAE2D6] hover:border-[#C5D9CB]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    checked
                      ? 'bg-[#6B8F78] border-[#6B8F78] text-white'
                      : 'border-[#C4B7A6] bg-white'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div
                    className={`text-sm font-semibold ${
                      checked ? 'line-through text-[#6E685F]' : 'text-[#2D2A26]'
                    }`}
                  >
                    {item.label}
                  </div>
                  <p className="text-xs text-[#6E685F] mt-0.5">{item.tip}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Essential Tips Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BEGINNER_TIPS.map((card) => (
          <div
            key={card.title}
            className={`rounded-3xl border p-5 space-y-3 ${accentCard[card.accent]}`}
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                {card.subtitle}
              </div>
              <h3 className="text-lg font-bold text-[#2D2A26] mt-0.5">{card.title}</h3>
            </div>
            <ul className="space-y-2">
              {card.points.map((pt, i) => (
                <li key={i} className="text-xs text-[#2D2A26] leading-relaxed flex gap-2">
                  <span className="font-bold opacity-70">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* FAQ Accordions */}
      <section className="rounded-3xl bg-white border border-[#EAE2D6] p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-[#6B8F78]" />
          <h2 className="text-lg font-bold text-[#2D2A26]">En Çok Merak Edilenler</h2>
        </div>

        <div className="space-y-2">
          {BEGINNER_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="text-sm font-semibold text-[#2D2A26]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#6E685F] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E685F] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#6E685F] leading-relaxed border-t border-[#EFE8DD] pt-3">
                    {faq.a}
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
