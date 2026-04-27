import { useRef } from "react";
import { Volume2 } from "lucide-react";

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  let isDisabled = false;
  if (!src)
    isDisabled = true;

  const title = isDisabled
    ? "Sorry, no sound for this one."
    : "Click to hear it";
  const srcAtt = src === "" ? undefined : src;

  return (
    <div
      className={`primary-btn center ${!isDisabled ? ' bg-second' : 'bg-second'}`}
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDisabled) handleClick(e);
        else window.alert("Sorry, no sound for this word.");
      }}
    >
      <audio src={srcAtt} ref={audioRef} className="inline-block"></audio>
      <Volume2 
       color='white'
       className='inline-block'
      />
      <p className="ml-2 text-text-main inline-block select-none">Pronunciation</p>
    </div>
  );
}
