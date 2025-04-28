"use client";
import { SearchBar } from '../../../../components/Note/SearchBar';
import { getUsersHistory } from "@/actions/manageNotes";
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

  const filteredWords = words?.filter((w) => {
    return w.word.toLowerCase().trim().includes(search.toLowerCase().trim());
  }) ?? [];


  function updateSearch(word: string){
    setSearch(word);
  }

  return (
    <>
      <SearchBar updateSearch={updateSearch}>
        <motion.p variants={itemVariants} className='p-3'>
            In menu there are delete icon for permanent word deletion and &quot;R&quot; for relearning the word.
            <br/>
            This page should helps you review the words you have learned. So
            basically this page just stores learned words, like personal
            history.<br/><br/>
            From this page and this page only you can delete note permanently or
            return word to learning process. <br/><br/>
            Bonus help: shortcut for focusing search bar is just key F.
        </motion.p>
      </SearchBar>

      {filteredWords.length === 0 && search != "" && (
       <ZeroNotesMessage message={'There is no word like that within your words.'}/>
      )}
      <Words props={filteredWords} historyNote={true} handle={() => {setRefresh(!refresh)}}></Words>
      {words?.length === 0 && search === '' && (
        <ZeroNotesMessage message={'Hmm, it looks like you don\'t have any words in your history right now. Time to learn!'}/>
      )}
    </>
  );
}
