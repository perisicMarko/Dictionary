"use client";
import { getUsersNotes } from "@/actions/manageNotes";
import Words from "@/components/Words";
import { TDBNoteEntry } from "@/lib/types";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/ZeroNotesMessage";
import { SearchBar } from "@/components/Note/SearchBar";
import { itemVariants } from "@/lib/animationVariants";
import Loading from "../../loading";

export default function YourWords() {
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>();
  const [search, setSearch] = useState("");
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    const fetch = async () => {
      const words = await getUsersNotes(tokenContext?.accessToken || "");
      setWords(words);
    };
    fetch();
  }, [tokenContext?.accessToken]);

  const filteredWords =
    words?.filter((w) => {
      return w.word.toLowerCase().trim().includes(search.toLowerCase().trim());
    }) ?? undefined;

  function updateSearch(word: string) {
    setSearch(word);
  }
  return (
    <>
      <SearchBar updateSearch={updateSearch}>
        <motion.p variants={itemVariants} className="p-3">
          This page is where all words you have not learned yet are stored.
          Hence if you have more spare time in the day you can review all words
          here. <br />
          Bonus help: shortcut for focusing search bar is just key F.
        </motion.p>
      </SearchBar>

      {filteredWords?.length === 0 && search != "" && (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      )}
      {!filteredWords && <Loading />}
      {filteredWords?.length != 0 && (
        <Words props={filteredWords} historyNote={false} handle={() => {}} />
      )}
      {filteredWords?.length === 0 && search === '' && (
        <ZeroNotesMessage
          message={
            "Hmm, it looks like you're not learning any words right now. Time to learn!"
          }
        />
      )}
    </>
  );
}
