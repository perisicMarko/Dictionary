/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { saveNotes, generateNotes } from '@/actions/manageNotes';

export default function UserInput(){
    const [help, setHelp] = useState(false);
    const [word, setWord] = useState(''); // for api request url
    const [note, setNote] = useState<any>([]); // for preview of api response
    const [checked, setChecked] = useState(false); // for displaying textarea for generated notes
    const [request, setRequest] = useState(false); // semaphore for requesting just once when button is clicked
    const [userNotes, setUserNotes] = useState(''); // for custom notes from user

    useEffect(() => {
        if(!request)
            return;
        const generate = async () => {
          try {
            const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word.trim());
            const result = await response.json();
            const tmp = await generateNotes(result);
            setNote(tmp);
            console.log("ispis generisanih beleski" + tmp);
            setRequest(false);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        generate(); // Call the async function
    
      });
    
   
    return (
        <>
        {!help ?
        <div key='input' className="flex flex-col justify-center items-center mt-60 w-[500px] h-[200px]">
                <div className="flex flex-col justify-center items-center">
                    <form action={saveNotes} className='w-[450px] bg-blue-400 rounded-4xl p-2 flex flex-col justify-center items-center'>
                        <span className="hover:underline cursor-pointer text-blue-950" onClick={() => setHelp(!help)}><b>Help</b></span> 
                        <input key='userWord' className='text-blue-50 formInput mt-8 mb-3' type="text" name="word" defaultValue={word} onChange={(e) => setWord(e.target.value)} placeholder='Enter new word here...'/>
                        {note?.error && <p className='error'>{note.error}</p>}
                        <span>Generate notes:  </span><input type='checkbox' checked={checked} onChange={() => setChecked(!checked)} name='generate'/>
                                                
                        <div>
                            <textarea  rows={5} cols={40} placeholder='Type your notes here...' className='mt-2 max-h-50' name='notes' onChange={(e) => setUserNotes(e.target.value)} key="userNotes" defaultValue={userNotes}/>
                        </div>     
                        {checked && 
                        <div>
                             <textarea  rows={5} cols={40} placeholder='Notes will be generated here...' className='mt-2 max-h-50' name='notes' key="genNotes" value={(note.error === undefined ? note?.parsedNote : "")}
                             onChange={(e) => {const tmp = {...note}; tmp.parsedNote = e.target.value; setNote(tmp)}}/>
                         </div>
                        }
                        <div className="center">
                            {checked && <button className='primaryBtn block' onClick={(e) => {e.preventDefault(); setRequest(true)}}> <b>Generate</b> </button>}
                            <button className='primaryBtn block'> <b>Save</b> </button>
                        </div>
                    </form>
                </div>
        </div>
        :
        <div key='help' className="bg-blue-400 w-[500px] rounded-4xl mt-60" id='help'>
          <div className='center'>
          <span className="hover:underline cursor-pointer text-blue-950" onClick={() => setHelp(!help)}><b>Help</b></span> 
          </div>
        <p>some pictures that give the idea of the application </p>
          <p>     
              Input word you would like to remember. Check the checkbox if you want to enter your own notes, otherwise they would be generated automatically.
              A note consisting the spelling, pronounciation, word definition and its nature(word is adjective, noun, verb, etc...) will be created.
          </p>
        </div>
        }
        </>
    );
}