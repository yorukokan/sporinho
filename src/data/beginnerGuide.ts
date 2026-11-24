export interface BagItem {
  id: string;
  label: string;
  tip: string;
}

export const GYM_BAG_ITEMS: BagItem[] = [
  { id: 'water', label: 'Su matarası (en az 750 ml)', tip: 'Set aralarında küçük yudumlar enerjini yüksek tutar.' },
  { id: 'towel', label: 'Küçük spor havlusu', tip: 'Makinelerin ve sehpaların üzerine sermek için şart.' },
  { id: 'shoes', label: 'Düz tabanlı / rahat spor ayakkabı', tip: 'Squat ve RDL yaparken düz taban dengeyi çok artırır.' },
  { id: 'headphones', label: 'Kulaklık & favori çalma listen', tip: 'Kendi moduna girmek ve odaklanmak için birebir.' },
  { id: 'hairtie', label: 'Yedek saç tokası', tip: 'Çantada her zaman bir yedek hayat kurtarır.' },
  { id: 'lock', label: 'Dolap kilidi / salon kartı', tip: 'Bazı salonlar kendi asma kilidini ister, kontrol et.' },
  { id: 'strap', label: 'Opsiyonel: Bilek kayışı (Ankle Strap)', tip: 'Salonda yoksa cable kickback için çok iş görür.' },
];

export interface GuideCard {
  title: string;
  subtitle: string;
  points: string[];
  accent: 'sage' | 'rose' | 'lavender';
}

export const BEGINNER_TIPS: GuideCard[] = [
  {
    title: 'Doğru Ağırlığı Nasıl Seçersin?',
    subtitle: '“Son 2 Tekrar” Kuralı',
    accent: 'sage',
    points: [
      'İlk hafta tek amacın hareketi doğru hissetmek — ağırlık hiç önemli değil, en hafiften başla.',
      '12 tekrar yapıyorsan, 10. tekrardan sonra hafif zorlanmaya başlamalı ama formun bozulmadan 12’yi bitirebilmelisin.',
      'Çok kolay geliyorsa bir sonraki hafta 1 kademe (2-2.5 kg) artırabilirsin.',
      'Uygulama her harekette en son kullandığın ağırlığı senin için hatırlar!',
    ],
  },
  {
    title: 'Salonda Özgüven & Rahatlık',
    subtitle: 'İlk Gün Gerginliği Çok Normal',
    accent: 'rose',
    points: [
      'İnan ki salondaki herkes kendi kulaklığında, kendi setine ve aynasına odaklı — kimse seni yargılamıyor.',
      'Bir makinenin ayarını bulamazsan yanındaki kişiye veya salon eğitmenine sormak dünyanın en normal şeyi.',
      'Kullanacağın makine doluysa panik yapma; programdaki bir sonraki hareketi öne alıp sonra geri dönebilirsin.',
      'İşin bitince ağırlıkları yerine bırakmak ve pedi havlunla silmek harika bir salon alışkanlığıdır.',
    ],
  },
  {
    title: 'İlk Hafta Kas Ağrısı & Toparlanma',
    subtitle: 'Bedenin Yeni Bir Dil Öğreniyor',
    accent: 'lavender',
    points: [
      'Antrenmandan 24-48 saat sonra tatlı bir kas ağrısı (DOMS) olması tamamen normal; 2. haftadan sonra çok azalır.',
      'Keskin eklem ağrısı (diz, bel, omuz batması) normal değildir — böyle bir şey hissedersen ağırlığı düşür veya dur.',
      'Haftada kaç gün gideceğin henüz net değilse 2 veya 3 günle başla; düzenli gitmek yoğun gitmekten her zaman iyidir.',
      'Antrenman sonrası bol su, yeterli protein ve güzel bir uyku kasların en iyi arkadaşıdır.',
    ],
  },
];

export const BEGINNER_FAQS = [
  {
    q: 'Kardiyo ağırlık antrenmanından önce mi sonra mı yapılmalı?',
    a: 'Başlangıçta sadece 4-5 dakika hafif ısınma yürüyüşü yap. Eğer ekstra 15-20 dakika eğimli yürüyüş gibi kardiyo yapacaksan, ağırlık antrenmanından SONRA yapmak enerjini korumanı sağlar.',
  },
  {
    q: 'Haftada kaç gün gitmeliyim, karar veremiyorum?',
    a: 'Hiç stres yapma! Başlangıç için haftada 2 veya 3 gün harikadır. Sporinho’nun ana ekranından gün sayısını istediğin hafta tek dokunuşla değiştirebilirsin.',
  },
  {
    q: 'Ağırlık çalışmak beni aşırı kaslı veya iri yapar mı?',
    a: 'Kesinlikle hayır! Kadın fizyolojisinde aşırı iri kas kütlesi kazanmak yıllar süren çok özel beslenme ve antrenman gerektirir. Ağırlık antrenmanı seni daha sıkı, güçlü, enerjik ve dik duruşlu yapar.',
  },
  {
    q: 'Bir gün gidemezsem programım bozulur mu?',
    a: 'Asla! Program haftanın sabit günlerine kilitli değil. Hangi gün gidersen sıradaki antrenman gününü açıp devam edebilirsin.',
  },
];
