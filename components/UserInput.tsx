'use client'
import { useEffect, useState, useRef } from 'react';
import { saveNotes, generateNotes } from '@/actions/manageNotes';
import AudioPlayer from './AudioPlayer';
import Image from 'next/image';
import { TWordApp } from '@/lib/types';
import Cookie from 'js-cookie';


export default function UserInput(){
    const [help, setHelp] = useState(false);
    const [word, setWord] = useState(''); // for api request url
    const [note, setNote] = useState<TWordApp | {error: string} | null>(); // for preview of api response
    const [generate, setGenerate] = useState(false); // for displaying textarea for generated notes
    const [request, setRequest] = useState(false); // semaphore for requesting just once when button is clicked
    const [userNotes, setUserNotes] = useState(''); // for custom notes from user
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
      setUserNotes('');      
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

    return (
        <>
        {!help ?
        <div key='input' className="flex flex-col justify-center items-center mt-60 w-[500px] h-[200px]">
                <div className="flex flex-col justify-center items-center">
                    <form action={(e) => {cleanUp(0); saveNotes(e);} } className='w-[450px] bg-blue-400 rounded-4xl p-2 flex flex-col justify-center items-center'>
                        <input key="userId" type='text' hidden name="userId" defaultValue={userId} />
                        <span className="hover:underline cursor-pointer text-blue-950" onClick={() => setHelp(!help)}><b>Help</b></span> 
                        <input ref={wordInputRef} key='userWord' className='text-blue-50 formInput mt-8 mb-3' type="text" name="word" value={word} onChange={(e) => setWord(e.target.value)} placeholder='Enter new word here...'/>
                        {error && <p className='error'>{error}</p>}
                        {note != null && isErrorNote(note) && note?.error && cleanUp(1)}
                        <div className="flex justify-start">
                          <input key="audioInput" type="text" hidden name="audio" defaultValue={isErrorNote(note) || note === null ? undefined : note?.audio}/>
                          {note != null && !isErrorNote(note) && note?.parsedNote ? <p className='text-start'>Pronounciation: <AudioPlayer src={isErrorNote(note) || note === null ? '' : note!.audio} ></AudioPlayer></p> : <></>}
                        </div>
                        {generate && 
                        <div>
                            <textarea  rows={5} cols={40} placeholder='Type your notes here...' className='mt-2 max-h-50' name='userNotes' onChange={(e) => setUserNotes(e.target.value)} key="userNotes" defaultValue={userNotes}/>
                        </div>     
                        }
                        {generate && 
                        <div>
                             <textarea  rows={5} cols={40} placeholder='Notes will be generated here...' className='mt-2 max-h-50' name='generatedNotes' key="genNotes" value={(isErrorNote(note) || note === null || note === undefined ? "" : note!.parsedNote)}
                             onChange={(e) => {const tmp = note; if(!isErrorNote(tmp) && tmp != null) tmp.parsedNote = (isErrorNote(tmp) || tmp === null || tmp === undefined ? '' : e.target.value); setNote(tmp)}}/>
                         </div>
                        }
                        <div className="center">
                            <button className='primaryBtn block'  onClick={(e) => {
                              setGenerate(true);
                              if(isDisabled === true){
                                wordInputRef?.current?.focus(); 
                                e.preventDefault(); 
                                return; 
                              }
                              e.preventDefault();
                              setRequest(true)}}>
                            <b>Generate</b> 
                            </button>
                            {generate && <button type='submit' className='primaryBtn block'> <b>Save</b> </button>}
                        </div>
                    </form>
                </div>
        </div>
        :
        <div key='help' className="w-[700px] h-[400] rounded-4xl mt-65 p-3"  id='help'>
          <div className='center rounded-t-2xl mb-5'>
          <h1 className="hover:underline cursor-pointer bg-blue-400 text-blue-950 w-1/4 text-center rounded-2xl" onClick={() => setHelp(!help)}><b>Help</b></h1> 
          </div>
          <div>
            <Image className="inline-block rounded-2xl ml-3 border-2 border-blue-300 mr-3" width={350} height={280} src='/wordInput.png' alt='picture of word input'></Image>
            <p className="inline-block bg-blue-400 rounded-2xl p-1 w-[200px]">     
                Input word you would like to remember, then click on &quot;Generate&quot; button. 
            </p>
          </div>
          <div className='mt-5'>
            <Image className="inline-block rounded-2xl ml-3 border-2 border-blue-300 mr-3" width={350} height={250} src='/generateNotes.png' alt='generate notes'></Image>
            <p className='inline-block bg-blue-400 rounded-2xl w-[200px] p-1'>
            Two textareas will pop up, one filled with generated notes from the app and empty one reserved for your personal notes.
            </p>
          </div>
        </div>
        }
        </>
    );
}