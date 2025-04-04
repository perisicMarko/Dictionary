import { useRef } from "react";
import Image from "next/image";

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  let containerStyle = 
  "inline-block cursor-pointer hover:scale-105 active:scale-95 rounded-3xl w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] center my-2";
  let isDisabled = false;
  if (src === null || src === undefined || src === "") {
    isDisabled = true;
  } else {
    containerStyle += " bg-blue-400";
  }

  const title = isDisabled
    ? "Sorry, no sound for this one."
    : "Click it to hear it.";
  const srcAtt = src === "" ? undefined : src;

  return (
    <div
      className={containerStyle}
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDisabled) handleClick(e);
        else window.alert("Sorry, no sound for this word.");
      }}
    >
      <audio src={srcAtt} ref={audioRef} className="inline-block"></audio>
      <Image
        className="inline-block"
        width={20}
        height={20}
        src={isDisabled ? "/speakerV2.svg" : "/speaker.svg"}
        alt="audioRef"
      ></Image>
      <p className="ml-2 text-white inline-block">Pronunciation</p>
    </div>
  );
}
