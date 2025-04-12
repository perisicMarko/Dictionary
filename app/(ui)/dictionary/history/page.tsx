"use client";
import { SearchBar } from '../../../../components/Note/SearchBar';
import { getUsersHistory } from "@/actions/manageNotes";
import Note from "@/components/Note";
import Words from "@/components/shared/Words";
import { TDBNoteEntry } from "@/lib/types";
import { useState, useContext, useLayoutEffect } from "react";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/shared/ZeroNotesMessage";
import { itemVariants } from '@/lib/animationVariants';
import { motion } from 'framer-motion';

export default function History() {
  const tokenContext = useContext(TokenContext);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>([]);
  
  useLayoutEffect(() => {
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


  function updateSearch(word: string){
    setSearch(word);
  }

  return (
    <>
      <SearchBar updateSearch={updateSearch}>
        <motion.p variants={itemVariants} className='p-3'>
            This page should helps you review the words you have learned. So
            basically this page just stores learned words, like personal
            history.<br/><br/>
            From this page and this page only you can delete note permanently or
            return word to learning process. Both of those actions can be
            accomplished by opening the menu on menu icon and clicking on trash
            icon or &quot;relearn&quot;.
        </motion.p>
      </SearchBar>

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
