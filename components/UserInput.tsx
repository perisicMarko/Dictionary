'use client'
import { useEffect, useState, useRef } from 'react';
import { saveNotes, generateNotes } from '@/actions/manageNotes';
import AudioPlayer from './AudioPlayer';
import Image from 'next/image';
import { TWordApp } from '@/lib/types';
import Cookie from 'js-cookie';
import { motion } from 'framer-motion';


export default function UserInput(){
    const [help, setHelp] = useState(false);
    const [word, setWord] = useState(''); // for api request url
    const [note, setNote] = useState<TWordApp | {error: string} | null>(); // for preview of api response
    const [generate, setGenerate] = useState(false); // for displaying textarea for generated notes
    const [request, setRequest] = useState(false); // semaphore for requesting just once when button is clicked
    const [error, setError] = useState('');
    const wordInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
      if(!request)
          return;
  
      const generate = async () => {
        try {
          const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word.trim());
          const result = await response.json();
          const tmp = await generateNotes(result);
          setNote(tmp);
          setRequest(false);
          setError('');
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      generate();
    
    });
    

    const userId = Cookie.get('userId');
    const isDisabled = word.trim() === '';

    function cleanUp(flag : number){  // when flag is 1 it should return <></> cause inside {} in return it is expected to return something
      setHelp(false);
      setGenerate(false);
      setRequest(false);
      setNote(null);
      if(flag){
        setError('Hm, there is a typo somewhere in your word spelling.');
        return <></>;
      }
      setWord('');
    };

    const isErrorNote = (note: TWordApp | { error: string } | null | undefined): note is { error: string } => {
      return note != null && "error" in note;
    };

    wordInputRef.current?.focus();

      const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.4,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    };

    let buttonStyle = 'bg-blue-400 text-white hover:scale-105 active:scale-95 rounded-3xl m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer inline-block';
    if(!(note && !isErrorNote(note))){
      buttonStyle += ' w-full col-span-2';
    }else if(note)
      buttonStyle += ' col-span-1';

    return (
        <>
        {!help ?
        <motion.div 
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 1}}
        key='input' className="flex flex-col justify-center items-center sm:mt-25 md:mt-25 xl:mt-70 w-3/4 h-3/4 sm:w-[500px] md: py-5 md-py-10 xl:py-16 sm:max-h-[400px] rounded-2xl">    
                <motion.div initial='hidden' animate='show' variants={containerVariants} className="flex flex-col justify-center items-center w-full">
                    <form action={(e) => {cleanUp(0); saveNotes(e);}} className='bg-slate-800 space-y-2 h-full rounded-4xl p-7 flex flex-col justify-center items-center w-full'>
                        <input key="userId" type='text' hidden name="userId" defaultValue={userId} />
                        <input ref={wordInputRef} key='userWord' className='rounded-3xl text-center textColor bg-white w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] p-2 mt-5' type="text" name="word" value={word} onChange={(e) => setWord(e.target.value)} placeholder='Enter new word here...'/>
                        {error && <p className='error'>{error}</p>}
                        {note != null && isErrorNote(note) && note?.error && cleanUp(1)}
                        <motion.div variants={itemVariants} className="flex justify-start w-full mt-2">
                          <input key="audioInput" type="text" hidden name="audio" defaultValue={isErrorNote(note) || note === null ? undefined : note?.audio}/>
                          {note != null && !isErrorNote(note) && note?.parsedNote ? <motion.div variants={itemVariants} className='w-full'><AudioPlayer src={isErrorNote(note) || note === null ? '' : note!.audio} ></AudioPlayer></motion.div> : <></>}
                        </motion.div>
                        {generate && 
                        <motion.div variants={itemVariants} className='w-full center'>
                            <textarea  rows={5} placeholder='Type your notes here...' className='p-2 rounded-2xl w-full  mt-2 text-slate-800 bg-white max-h-40 xl:max-h-70' name='userNotes' key="userNotes"/>
                        </motion.div>     
                        }
                        {generate && 
                        <motion.div variants={itemVariants} className='p-3 w-full'>
                            <h2 className='text-blue-400 self-start'><b>{!isErrorNote(note) && note?.word}</b></h2>
                            <textarea  rows={5} placeholder='Notes will be generated here...' className='w-full mt-2 text-blue-300 h-50 xl:h-100 xl:max-h-100 px-1 resize-none xl:resize-y' name='generatedNotes' key="genNotes" defaultValue={(isErrorNote(note) || note === null || note === undefined ? "" : note!.parsedNote)}/>
                         </motion.div>
                        }
                        <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                            <motion.div initial='hidden' animate='show' variants={containerVariants} className='w-full grid grid-cols-2 gap-2'>
                              <motion.button variants={itemVariants} className={buttonStyle}  onClick={(e) => {
                                setGenerate(true);
                                if(isDisabled === true){
                                  wordInputRef?.current?.focus(); 
                                  e.preventDefault(); 
                                  return; 
                                }
                                e.preventDefault();
                                setRequest(true)}}>
                              <b>Generate</b> 
                              </motion.button>
                              {generate && <motion.button variants={itemVariants} type='submit' className={buttonStyle}> <b>Save</b> </motion.button>}
                            </motion.div>
                            <motion.span variants={itemVariants} className="hover:underline hover:scale-105 cursor-pointer text-white mt-5" onClick={() => setHelp(!help)}>Need any help?</motion.span> 
                        </motion.div>
                    </form>
                </motion.div>
        </motion.div>
        :
        <motion.div initial='hidden' animate='show' variants={containerVariants} key='help' className="w-3/4 sm:w-[500px] md:w-[600px] xl:w-[700px] xl:h-[400px] rounded-4xl mt-10 xl:mt-50 p-3"  id='help'>          
          <motion.h2 variants={itemVariants} className="hover:underline mb-5 cursor-pointer bg-slate-800 text-white sm:h-[30px] p-1.5 text-center h-[25px] sm:h-[30[px] w-full rounded-3xl" onClick={() => setHelp(!help)}>{help ? 'Go back' : 'Need hlep?'}</motion.h2> 
          <motion.div variants={itemVariants} className='flex flex-col md:flex-row justify-center items-center'>
            <Image className="inline-block rounded-4xl mr-3" width={350} height={280} src='/wordInput.png' alt='picture of word input'></Image>
            <motion.p variants={{hidden: {opacity: 0, x:100}, show: {opacity: 1, x: 0}}} className="inline-block bg-slate-800 text-white rounded-2xl p-2 text-center sm:w-[200px]">     
                Input the word you would like to remember, then click the &quot;Generate&quot; button. 
            </motion.p>
          </motion.div>
          <motion.div variants={itemVariants} className='mt-5 flex flex-col md:flex-row justify-center items-center'>
            <Image className="inline-block rounded-4xl mr-3" width={350} height={50} src='/generateNotes.png' alt='generate notes'></Image>
            <motion.p variants={{hidden: {opacity: 0, x:100}, show: {opacity: 1, x: 0}}} className='inline-block bg-slate-800 text-white rounded-3xl p-2 text-center sm:w-[200px]'>
                Pronunciation of word and two text areas will pop up: one filled with generated notes from the app and an empty one reserved for your personal notes.
            </motion.p>
          </motion.div>
        </motion.div>
        }
        </>
    );
}