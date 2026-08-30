"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  shouldStart: boolean;
}

export default function MusicPlayer({ shouldStart }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    audio.loop = true;
  }, []);

  // Davetiye açılır açılmaz müziği otomatik başlat (kullanıcının "aç" dokunuşuna bağlı,
  // tarayıcı otomatik oynatma kısıtlamasını böyle aşıyoruz).
  useEffect(() => {
    if (!shouldStart) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [shouldStart]);

  function toggleSound() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/Passacaglia_Handel_Halvorsen.mp3"
        loop
        preload="none"
      />

      {shouldStart && (
        <button
          onClick={toggleSound}
          aria-label={playing ? "Sesi kapat" : "Sesi aç"}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-paper-navbar backdrop-blur-md border border-rose/30 shadow-lg flex items-center justify-center hover:scale-110 hover:bg-paper-cream transition-all duration-200"
        >
          {playing ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </button>
      )}
    </>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-warm"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-warm-light"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
