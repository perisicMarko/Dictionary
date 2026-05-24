"use client";

import { useRef } from "react";
import { Volume2 } from "lucide-react";

export default function AudioPlayer({ src }: { src: Uint8Array<ArrayBuffer> | null}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  // todo: this check if src is null should be removed, when schema changes to audio storing bytes, server will serve encoded bytes as base64 string
  // and when there is not audio in the database src will be empty string, so this check will return to its previous stat: src.empty() or src.trim() === ""
  const isDisabled = !src;
  const title = isDisabled
    ? "Sorry, no sound for this one."
    : "Click to hear it";

  let srcUrl;
  if(src){
    const blob = new Blob([src], { type: "audio/mpeg"});
    srcUrl = URL.createObjectURL(blob);
  }

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
