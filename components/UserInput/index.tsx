"use client";
import { Help } from './Help';
import { useEffect, useState } from "react";
import { generateNotes } from "@/actions/manageNotes";
import { TWordApp } from "@/lib/types";
import SaveNoteForm from './SaveNoteForm';

export default function UserInput() {
  const [help, setHelp] = useState(false);
  const [word, setWord] = useState(""); // for api request url
  const [note, setNote] = useState<TWordApp | { error: string } | null>(); // for preview of api response
  const [generate, setGenerate] = useState(false); // for displaying textarea for generated notes
  const [request, setRequest] = useState(false); // semaphore for requesting just once when button is clicked
  const [error, setError] = useState("");

  useEffect(() => {
    if (!request) return;

    const generate = async () => {
      try {
        const response = await fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.trim()
        );
        if(response.ok){
          const result = await response.json();
          const tmp = await generateNotes(result);
          setNote(tmp);
          setRequest(false);
          setError("");
        }else{
          cleanUp(1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    generate();
  });

  const isDisabled = word.trim() === "";

  function cleanUp(flag: number) {
    setHelp(false);
    setGenerate(false);
    setRequest(false);
    setNote(null);
    if (flag) {// when flag is 1 it should return <></> cause inside {} in return it is expected to return something
      setError("Hm, there is a typo somewhere in your word spelling.");
      return <></>;
    }
    setWord("");
  }
  
  function toggleHelp(){
    setHelp(!help);
  }
  function changeWord(e: string){
    setWord(e);
  }
  function changeGenerate(e: boolean){
    setGenerate(e);
  }

  function changeRequest(e: boolean){
    setRequest(e);
  }

  return (
    <>
      {!help ? (
        <SaveNoteForm 
        cleanUp={cleanUp} 
        note={note}
        changeWord={changeWord}
        error={error} 
        generate={generate}
        toggleHelp={toggleHelp}
        isDisabled={isDisabled}
        changeGenerate={changeGenerate}
        changeRequest={changeRequest}
        />
      ) : (
        <Help toggleHelp={toggleHelp} help={help} />
      )}
    </>
  );
}
