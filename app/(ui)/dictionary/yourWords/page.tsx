"use client";
import { getUsersNotes } from "@/actions/manageNotes";
import Words from "@/components/shared/Words";
import Note from "@/components/Note";
import { TDBNoteEntry } from "@/lib/types";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/shared/ZeroNotesMessage";
import { SearchBar } from "@/components/Note/SearchBar";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function YourWords() {
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>([]);
  const [search, setSearch] = useState("");
  const [help, setHelp] = useState(false);
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    const fetch = async () => { 
      const words = await getUsersNotes(tokenContext?.accessToken || '');
      setWords(words);
    };
    fetch();
  }, [tokenContext?.accessToken]);

  const index : number =
    words?.findIndex(
      (word: TDBNoteEntry) =>
        word.word.toString().toLowerCase().trim() === search.toString().toLowerCase().trim()
    ) ?? -1;

  function toggleHelp(){
    setHelp(!help);
  }
  function updateSearch(word: string){
    setSearch(word);
  }
  return (
    <>
      <SearchBar toggleHelp={toggleHelp} updateSearch={updateSearch} />
      {help && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="bg-slate-800 w-3/4 sm:w-[600px] mt-5 rounded-3xl text-white"
        >
          <div className="flex justify-end bg-slate-950 rounded-t-2xl">
            <span className="xBtn mr-4 py-1" onClick={() => setHelp(!help)}>
              <b>x</b>
            </span>
          </div>
          <motion.p variants={itemVariants} className="p-3">
            This page is where all words you have not learned yet are stored.
            Hence if you have more spare time in the day you can review all
            words here.
          </motion.p>
        </motion.div>
      )}
      {index === -1 && search != "" && (
        <ZeroNotesMessage message={'There is no word like that within your words.'}/>
      )}
      {words && search != "" && index != -1 && (
        <Note prop={words[index]} historyNote={false} handle={() => {}}></Note>
      )}
      {words && search === "" ? (
        <Words props={words} historyNote={false} handle={() => {}}></Words>
      ) : (
        <></>
      )}
      {words?.length === 0 && search === '' && (
        <ZeroNotesMessage message={'Hmm, it looks like you\'re not learning any words right now. Time to learn!'} />
      )}
    </>
  );
}
