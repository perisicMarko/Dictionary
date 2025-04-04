"use client";
import { SearchBar } from '../../../../components/Note/SearchBar';
import { getUsersHistory } from "@/actions/manageNotes";
import Note from "@/components/Note";
import Words from "@/components/shared/Words";
import { TDBNoteEntry } from "@/lib/types";
import { useEffect, useState, useContext } from "react";
import { TokenContext } from "@/components/TokenContextProvider";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import ZeroNotesMessage from "@/components/shared/ZeroNotesMessage";

export default function History() {
  const tokenContext = useContext(TokenContext);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [help, setHelp] = useState(false);
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>([]);
  
  useEffect(() => {
    const fetch = async () => { 
      const words = await getUsersHistory(tokenContext?.accessToken || '');
      setWords(words);
    };
    fetch();
  }, [tokenContext?.accessToken, refresh]);

  const index : number = words?.findIndex(
    (word: TDBNoteEntry) =>
      word.word.toLowerCase().trim() === search.toLowerCase().trim()
  ) ?? -1;

  function toggleHelp(){
    setHelp(!help);
  }
  function updateSearch(word: string){
    setSearch(word);
  }
  return (
    <>
      <SearchBar toggleHelp={toggleHelp} updateSearch={updateSearch}/>
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
            This page should helps you review the words you have learned. So
            basically this page just stores learned words, like personal
            history.
            <br />
            <br />
            From this page and this page only you can delete note permanently or
            return word to learning process. Both of those actions can be
            accomplished by opening the menu on menu icon and clicking on trash
            icon or &quot;relearn&quot;.
          </motion.p>
        </motion.div>
      )}
      {index === -1 && search != "" && (
       <ZeroNotesMessage message={'There is no word like that within your words.'}/>
      )}
      {words && search != "" && index != -1 && (
        <Note prop={words[index]} historyNote={true} handle={() => {setRefresh(!refresh)}}></Note>
      )}
      {words && search === "" && (
        <Words props={words} historyNote={true} handle={() => {setRefresh(!refresh)}}></Words>
      )}
      {words?.length === 0 && search === '' && (
        <ZeroNotesMessage message={'Hmm, it looks like you don\'t have any words in your history right now. Time to learn!'}/>
      )}
    </>
  );
}
