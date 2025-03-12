'use client'
import { useRef } from 'react';
import Image from 'next/image';

export default function AudioPlayer({src} : {src: string}){
    const audioRef = useRef<HTMLAudioElement>(null);

    function handleClick(e : React.MouseEvent<HTMLImageElement>){
        e.stopPropagation();
        if (audioRef.current) {
          audioRef.current.play(); // Play the audio
        }
      }
   
    let classString = "inline-block cursor-pointer hover:scale-115 bg-blue-950/20 rounded-full";
    let isDisabled = false;
    if(src === null || src === undefined || src === ''){
      classString += ' bg-red-700';
      isDisabled = true;
    }
    const title = (isDisabled ? 'Sorry, no sound for this one.' : 'Click it to hear it.');
    const srcAtt = (src === '' ? undefined: src);

    return (
        <>
            <audio src={srcAtt} ref={audioRef} className='inline-block'></audio>
            <Image className={classString} title={title} width={20} height={20} src='/pronuanciation.svg' onClick={(e) => {
              e.stopPropagation();
              if(!isDisabled) 
                handleClick(e)
              else window.alert('Sorry, no sound for this word.')
              }} alt='audioRef'></Image> 
        </>
    );
}