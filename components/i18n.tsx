"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "tr";

const LOCALE_STORAGE_KEY = "wedding-locale";

type Dictionary = {
  nav: { event: string; gallery: string; rsvp: string; menu: string; lang: string };
  hero: { intro: string; datePlace: string; cta: string };
  countdown: { title: string; days: string; hours: string; minutes: string; seconds: string; localTime: string };
  /** Başlıksız davet metni (Our Story kaldırıldı) */
  story: { text: string };
  event: {
    eyebrow: string;
    title: string;
    items: { title: string; time: string; description: string }[];
    /** Nikâh mekânı (Tower Hamlets) için Google Haritalar yol tarifi bağlantısı etiketi */
    ceremonyDirectionsLabel: string;
    /** Kutlama mekânı (Old Brewery) için Google Haritalar yol tarifi bağlantısı etiketi */
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
    langEn: string;
    langTr: string;
    langAria: string;
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

const dictionary: Record<Locale, Dictionary> = {
  en: {
    nav: {
      event: "Event",
      gallery: "Gallery",
      rsvp: "RSVP",
      menu: "Toggle menu",
      lang: "Language",
    },
    hero: {
      intro: "We're getting married",
      datePlace: "16-05-2026 • The Old Brewery, Greenwich, London",
      cta: "RSVP Now",
    },
    countdown: {
      title: "Counting the Days",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      localTime: "16/05/2026 · 13:45 BST · London",
    },
    story: {
      text: "We would be delighted to have you with us on the 16th of May and to celebrate this special moment together.",
    },
    event: {
      eyebrow: "The Details",
      title: "Wedding Day",
      items: [
        {
          title: "Ceremony",
          time: "13:45 - 15:00",
          description:
            "Tower Hamlets Register Office, St Georges Town Hall, 236 Cable Street, London, E1 0BL.",
        },
        {
          title: "Celebration",
          time: "19:00",
          description:
            "The Old Brewery, Greenwich, London SE10, United Kingdom.",
        },
      ],
      ceremonyDirectionsLabel: "Get directions (Google Maps)",
      celebrationDirectionsLabel: "Get directions (Google Maps)",
    },
    gallery: {
      eyebrow: "Moments",
      title: "Gallery",
      photoAlt: "Wedding photo",
    },
    passage: {
      imageAlt: "Decorative illustration for Duygu and Alper's wedding site",
    },
    rsvp: {
      eyebrow: "Be There",
      title: "RSVP",
      subtitle: "We would love for you to celebrate with us.",
      successTitle: "Thank You!",
      successText: "Your response has been recorded. We can't wait to see you!",
      submitAnother: "Submit another response",
      nameLabel: "Full Name",
      namePlaceholder: "Your name",
      partySizeLabel: "How many people will attend?",
      companionLabel: "Companion {n} — full name",
      companionPlaceholder: "Full name",
      companionRequiredError: "Please enter every companion’s full name.",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+44XXXXXXXXXX",
      notesLabel: "Notes (optional)",
      notesPlaceholder: "Allergies, dietary needs, a message for us…",
      attendingLabel: "Will you attend?",
      accept: "Joyfully Accept",
      decline: "Regretfully Decline",
      error: "Something went wrong. Please try again.",
      sending: "Sending...",
      send: "Send RSVP",
      calendarTitle: "Add celebration to your calendar",
      calendarGoogleCelebration: "Google Calendar",
      calendarDownloadIcs: "Apple & other calendars (.ics)",
      calendarIcsFilename: "alper-duygu-wedding.ics",
    },
    footer: {
      madeWithLove: "Made with love",
      datePlace: "16-05-2026 • The Old Brewery, Greenwich, London",
    },
    admin: {
      dashboardTitle: "Guest Dashboard",
      dashboardSubtitle: "Duygu & Alper — Wedding RSVP management",
      logout: "Log out",
      backToSite: "Back to site",
      totalResponses: "Total responses",
      attendingStat: "Attending",
      declinedStat: "Declined",
      guestList: "Guest list",
      downloadPdf: "Download PDF",
      downloadPdfAttendingOnly: "PDF — attending only",
      downloadPdfDeclinedOnly: "PDF — declined only",
      preparingPdf: "Preparing…",
      pdfError: "PDF could not be created. Please try again.",
      downloadExcel: "Download Excel (all guests)",
      preparingExcel: "Preparing…",
      excelError: "Could not create the Excel file. Please try again.",
      excelFilePrefix: "alper-duygu-rsvp-all",
      excelSheetName: "Guests",
      loadingGuests: "Loading guests…",
      connectionError: "Connection error",
      noResponses: "No RSVP responses yet.",
      colName: "Name",
      colEmail: "Email",
      colPhone: "Phone",
      colStatus: "Status",
      colDate: "Date",
      colParty: "Main guest",
      colPartyHint:
        "If several people share one RSVP: main guest’s name and place (1 = host, 2+ = companions). Empty if only one person or not attending.",
      colNotes: "Notes",
      statusAttending: "Attending",
      statusDeclined: "Declined",
      loginTitle: "Admin",
      loginSubtitle: "Duygu & Alper — RSVP panel",
      usernameLabel: "Username",
      passwordLabel: "Password",
      loginButton: "Sign in",
      loginLoading: "Signing in…",
      backHome: "← Back to site",
      loginFailed: "Login failed",
      networkError: "Network error",
      langEn: "EN",
      langTr: "TR",
      langAria: "Language",
      pdfDocTitle: "Duygu & Alper — Guest list (RSVP)",
      pdfDocTitleAttendingOnly: "Duygu & Alper — Attending guests",
      pdfDocTitleDeclinedOnly: "Duygu & Alper — Declined guests",
      pdfGenerated: "Generated",
      pdfTotal: "Total",
      pdfAttending: "Attending",
      pdfDeclined: "Declined",
      pdfColSubmitted: "Submitted",
      pdfFilePrefix: "alper-duygu-rsvp",
      pdfFilePrefixAttendingOnly: "alper-duygu-rsvp-attending",
      pdfFilePrefixDeclinedOnly: "alper-duygu-rsvp-declined",
      sortByName: "Sort by name (A–Z)",
      sortByStatus: "Sort by attendance",
      sortByDate: "Sort by submission date",
      sortAsc: "Ascending",
      sortDesc: "Descending",
      colActions: "Actions",
      deleteGuest: "Delete",
      deleteGuestConfirm:
        'Remove "{name}" from the guest list? This cannot be undone.',
      deleteGuestError: "Could not delete this guest.",
      deleteGuestDeleting: "Deleting…",
    },
  },
  tr: {
    nav: {
      event: "Etkinlik",
      gallery: "Galeri",
      rsvp: "Katılım",
      menu: "Menüyü aç/kapat",
      lang: "Dil",
    },
    hero: {
      intro: "Evleniyoruz",
      datePlace: "16-05-2026 • The Old Brewery, Greenwich, Londra",
      cta: "Katılım Gönder",
    },
    countdown: {
      title: "Geri Sayım",
      days: "Gün",
      hours: "Saat",
      minutes: "Dakika",
      seconds: "Saniye",
      localTime: "16/05/2026 · 13:45 BST · Londra",
    },
    story: {
      text: "16 Mayıs'ta sizleri de aramızda görmekten ve bu özel anı birlikte kutlamaktan memnuniyet duyacağız.",
    },
    event: {
      eyebrow: "Detaylar",
      title: "Düğün Günü",
      items: [
        {
          title: "Nikâh",
          time: "13:45 - 15:00",
          description:
            "Tower Hamlets Evlendirme Dairesi, St Georges Town Hall, 236 Cable Street, Londra, E1 0BL.",
        },
        {
          title: "Kutlama",
          time: "19:00",
          description:
            "The Old Brewery, Greenwich, Londra SE10, Birleşik Krallık.",
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
      datePlace: "16-05-2026 • The Old Brewery, Greenwich, Londra",
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
      langEn: "EN",
      langTr: "TR",
      langAria: "Dil",
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
  },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (stored === "tr" || stored === "en") {
          setLocaleState(stored);
        }
      } catch {
        /* ignore */
      }
    });
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionary[locale],
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
