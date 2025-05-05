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
  const [showSwitch, setShowSwitch] = useState(false);

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
    });

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

      <div className="appWidth bg-slate-800 rounded-3xl grid grid-cols-3 mt-5">
        <div className={"text-white rounded-l-3xl w-full h-full p-3 cursor-pointer flex justify-end " + (showSwitch && " bg-blue-400 font-bold")} onClick={() => setShowSwitch(true)}>Show drawers</div>
        <div className={(showSwitch ? "bg-gradient-to-l " : "bg-gradient-to-r ") + "from-slate-800 to-blue-400"}></div>
        <div className={"text-white rounded-r-3xl w-full h-full p-3 cursor-pointer " + (!showSwitch && " bg-blue-400 font-bold")} onClick={() => setShowSwitch(false)}>Show notes</div>
      </div>

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
