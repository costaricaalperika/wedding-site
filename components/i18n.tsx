"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Site is Turkish-only. */
export type Locale = "tr";

type Dictionary = {
  nav: { event: string; gallery: string; rsvp: string; menu: string };
  hero: { intro: string; datePlace: string; cta: string };
  countdown: { title: string; days: string; hours: string; minutes: string; seconds: string; localTime: string };
  /** Başlıksız davet metni (Our Story kaldırıldı) */
  story: { text: string };
  event: {
    eyebrow: string;
    title: string;
    items: { title: string; time: string; description: string }[];
    /** Nikâh mekânı (Fuar Evlendirme Dairesi) için Google Haritalar yol tarifi bağlantısı etiketi */
    ceremonyDirectionsLabel: string;
    /** Kutlama mekânı (Viola Event) için Google Haritalar yol tarifi bağlantısı etiketi */
    celebrationDirectionsLabel: string;
  };
  gallery: { eyebrow: string; title: string; photoAlt: string };
  /** Bölümler arası passage görselleri (erişilebilir alt metin) */
  passage: { imageAlt: string };
  rsvp: {
    eyebrow: string;
    title: string;
    subtitle: string;
    successTitle: string;
    successText: string;
    submitAnother: string;
    nameLabel: string;
    namePlaceholder: string;
    partySizeLabel: string;
    companionLabel: string;
    companionPlaceholder: string;
    companionRequiredError: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    attendingLabel: string;
    accept: string;
    decline: string;
    error: string;
    sending: string;
    send: string;
    /** Başarılı katılım + davet açıldıysa takvim butonları */
    calendarTitle: string;
    calendarGoogleCelebration: string;
    calendarDownloadIcs: string;
    calendarIcsFilename: string;
  };
  footer: { madeWithLove: string; datePlace: string };
  admin: {
    dashboardTitle: string;
    dashboardSubtitle: string;
    logout: string;
    backToSite: string;
    totalResponses: string;
    attendingStat: string;
    declinedStat: string;
    guestList: string;
    downloadPdf: string;
    downloadPdfAttendingOnly: string;
    downloadPdfDeclinedOnly: string;
    preparingPdf: string;
    pdfError: string;
    downloadExcel: string;
    preparingExcel: string;
    excelError: string;
    excelFilePrefix: string;
    excelSheetName: string;
    loadingGuests: string;
    connectionError: string;
    noResponses: string;
    colName: string;
    colEmail: string;
    colPhone: string;
    colStatus: string;
    colDate: string;
    colParty: string;
    colPartyHint: string;
    colNotes: string;
    statusAttending: string;
    statusDeclined: string;
    loginTitle: string;
    loginSubtitle: string;
    usernameLabel: string;
    passwordLabel: string;
    loginButton: string;
    loginLoading: string;
    backHome: string;
    loginFailed: string;
    networkError: string;
    pdfDocTitle: string;
    pdfDocTitleAttendingOnly: string;
    pdfDocTitleDeclinedOnly: string;
    pdfGenerated: string;
    pdfTotal: string;
    pdfAttending: string;
    pdfDeclined: string;
    pdfColSubmitted: string;
    pdfFilePrefix: string;
    pdfFilePrefixAttendingOnly: string;
    pdfFilePrefixDeclinedOnly: string;
    sortByName: string;
    sortByStatus: string;
    sortByDate: string;
    sortAsc: string;
    sortDesc: string;
    colActions: string;
    deleteGuest: string;
    deleteGuestConfirm: string;
    deleteGuestError: string;
    deleteGuestDeleting: string;
  };
};

const tr: Dictionary = {
  nav: {
    event: "Etkinlik",
    gallery: "Galeri",
    rsvp: "Katılım",
    menu: "Menüyü aç/kapat",
  },
  hero: {
    intro: "Evleniyoruz",
    datePlace: "03-10-2026 • Viola Event, İzmir",
    cta: "Katılım Gönder",
  },
  countdown: {
    title: "Geri Sayım",
    days: "Gün",
    hours: "Saat",
    minutes: "Dakika",
    seconds: "Saniye",
    localTime: "03/10/2026 · 14:30 · İzmir",
  },
  story: {
    text: "3 Ekim'de sizleri de aramızda görmekten ve bu özel anı birlikte kutlamaktan memnuniyet duyacağız.",
  },
  event: {
    eyebrow: "Detaylar",
    title: "Düğün Günü",
    items: [
      {
        title: "Nikâh",
        time: "13:45 - 15:00",
        description: "Fuar Evlendirme Dairesi, Kültür Parkı, Alsancak Mah, 35260 Konak/İzmir.",
      },
      {
        title: "Kutlama",
        time: "19:00",
        description: "Viola Event, İzmir.",
      },
    ],
    ceremonyDirectionsLabel: "Yol tarifi al (Google Haritalar)",
    celebrationDirectionsLabel: "Yol tarifi al (Google Haritalar)",
  },
  gallery: {
    eyebrow: "Anılar",
    title: "Galeri",
    photoAlt: "Düğün fotoğrafı",
  },
  passage: {
    imageAlt: "Duygu ve Alper düğün sitesi için süsleme görseli",
  },
  rsvp: {
    eyebrow: "Bizimle Olun",
    title: "Katılım Formu",
    subtitle: "Bu özel günde yanımızda olmanızı çok isteriz.",
    successTitle: "Teşekkürler!",
    successText: "Cevabınız kaydedildi. Sizi görmek için sabırsızlanıyoruz!",
    submitAnother: "Yeni bir cevap gönder",
    nameLabel: "Ad Soyad",
    namePlaceholder: "Adınız soyadınız",
    partySizeLabel: "Kaç kişi katılacak?",
    companionLabel: "Eşlikçi {n} — ad soyad",
    companionPlaceholder: "Ad soyad",
    companionRequiredError: "Lütfen tüm eşlikçilerin adını soyadını yazın.",
    emailLabel: "E-posta",
    emailPlaceholder: "eposta@örnek.com",
    phoneLabel: "Telefon Numarası",
    phonePlaceholder: "+90XXXXXXXXXX",
    notesLabel: "Not (isteğe bağlı)",
    notesPlaceholder: "Alerji, beslenme, çifte kısa bir mesajınız…",
    attendingLabel: "Katılabilecek misiniz?",
    accept: "Memnuniyetle Katılıyorum",
    decline: "Maalesef Katılamayacağım",
    error: "Bir hata oluştu. Lütfen tekrar deneyin.",
    sending: "Gönderiliyor...",
    send: "Katılım Gönder",
    calendarTitle: "Kutlamayı takviminize ekleyin",
    calendarGoogleCelebration: "Google Takvim",
    calendarDownloadIcs: "Apple ve diğer takvimler (.ics)",
    calendarIcsFilename: "alper-duygu-dugun.ics",
  },
  footer: {
    madeWithLove: "Sevgiyle hazırlandı",
    datePlace: "03-10-2026 • Viola Event, İzmir",
  },
  admin: {
    dashboardTitle: "Misafir paneli",
    dashboardSubtitle: "Duygu & Alper — Düğün katılım yönetimi",
    logout: "Çıkış",
    backToSite: "Ana siteye dön",
    totalResponses: "Toplam yanıt",
    attendingStat: "Katılıyor",
    declinedStat: "Katılmıyor",
    guestList: "Misafir listesi",
    downloadPdf: "PDF indir",
    downloadPdfAttendingOnly: "PDF — sadece katılacaklar",
    downloadPdfDeclinedOnly: "PDF — katılmayacaklar",
    preparingPdf: "Hazırlanıyor…",
    pdfError: "PDF oluşturulamadı. Lütfen tekrar deneyin.",
    downloadExcel: "Excel indir (tüm misafirler)",
    preparingExcel: "Hazırlanıyor…",
    excelError: "Excel dosyası oluşturulamadı. Lütfen tekrar deneyin.",
    excelFilePrefix: "alper-duygu-katilim-tum",
    excelSheetName: "Misafirler",
    loadingGuests: "Misafirler yükleniyor…",
    connectionError: "Bağlantı hatası",
    noResponses: "Henüz katılım yanıtı yok.",
    colName: "İsim",
    colEmail: "E-posta",
    colPhone: "Telefon",
    colStatus: "Durum",
    colDate: "Tarih",
    colParty: "Ana davetli",
    colPartyHint:
      "Aynı formda birden fazla kişi varsa: ana davetlinin adı ve sıra (ör. Ayşe - 1, Ayşe - 2). Tek kişi veya katılmıyorsa boş.",
    colNotes: "Not",
    statusAttending: "Katılıyor",
    statusDeclined: "Katılmıyor",
    loginTitle: "Yönetim",
    loginSubtitle: "Duygu & Alper — Katılım paneli",
    usernameLabel: "Kullanıcı adı",
    passwordLabel: "Şifre",
    loginButton: "Giriş yap",
    loginLoading: "Giriş yapılıyor…",
    backHome: "← Ana siteye dön",
    loginFailed: "Giriş başarısız",
    networkError: "Ağ hatası",
    pdfDocTitle: "Duygu & Alper — Misafir listesi (Katılım)",
    pdfDocTitleAttendingOnly: "Duygu & Alper — Katılacaklar",
    pdfDocTitleDeclinedOnly: "Duygu & Alper — Katılmayacaklar",
    pdfGenerated: "Oluşturulma",
    pdfTotal: "Toplam",
    pdfAttending: "Katılıyor",
    pdfDeclined: "Katılmıyor",
    pdfColSubmitted: "Gönderim",
    pdfFilePrefix: "alper-duygu-katilim",
    pdfFilePrefixAttendingOnly: "alper-duygu-katilim-katilacaklar",
    pdfFilePrefixDeclinedOnly: "alper-duygu-katilim-katilmayacaklar",
    sortByName: "İsme göre sırala (A–Z)",
    sortByStatus: "Duruma göre sırala (katılıyor / katılmıyor)",
    sortByDate: "Gönderim tarihine göre sırala",
    sortAsc: "Artan",
    sortDesc: "Azalan",
    colActions: "İşlem",
    deleteGuest: "Sil",
    deleteGuestConfirm:
      '"{name}" kaydını listeden silmek istiyor musunuz? Bu işlem geri alınamaz.',
    deleteGuestError: "Kayıt silinemedi.",
    deleteGuestDeleting: "Siliniyor…",
  },
};

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
};

const contextValue: I18nContextValue = { locale: "tr", t: tr };

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
