"use client";
import { getUsersNotes } from "@/actions/manageNotes";
import Words from "@/components/shared/Words";
import Note from "@/components/Note";
import { TDBNoteEntry } from "@/lib/types";
import { useState, useContext, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/shared/ZeroNotesMessage";
import { SearchBar } from "@/components/Note/SearchBar";
import { itemVariants } from "@/lib/animationVariants";

export default function YourWords() {
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>([]);
  const [search, setSearch] = useState("");
  const tokenContext = useContext(TokenContext);

  useLayoutEffect(() => {
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


  function updateSearch(word: string){
    setSearch(word);
  }
  return (
    <>
      <SearchBar updateSearch={updateSearch}>
        <motion.p variants={itemVariants} className="p-3">
            This page is where all words you have not learned yet are stored.
            Hence if you have more spare time in the day you can review all
            words here.
          </motion.p>
      </SearchBar>

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
