"use client";

import { useRef } from "react";
import { Volume2 } from "lucide-react";

export default function AudioPlayer({ src }: { src: string | null}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isDisabled = !src || src.trim() === "";
  const title = isDisabled
    ? "Sorry, no sound for this one."
    : "Click to hear it";

  // temp hack, all audios stored in the db should migrate to tts generated ones, but for the sake of not breaking audio for already stored words this is easy temporary solution
  const srcUrl = src?.includes('http') ? src : `data:audio/mp3;base64,${src}`;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (isDisabled || !audioRef.current) {
      return;
    }

    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  }

  return (
    <button
      type="button"
      className="primary-btn center bg-second disabled:opacity-40 disabled:hover:scale-100! disabled:cursor-not-allowed"
      title={title}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {!isDisabled ? <audio src={srcUrl} ref={audioRef} className="inline-block" /> : null}
      <Volume2
       color="white"
       className="inline-block"
      />
      <p className="ml-2 text-text-main inline-block select-none">Pronunciation</p>
    </button>
  );
}
