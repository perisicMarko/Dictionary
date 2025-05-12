import { getUsersNotes } from "@/actions/manageNotes";
import Words from "@/components/common/Words";
import { TDBNoteEntry } from "@/lib/types";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import { SearchBar } from "@/components/common/SearchBar";
import { itemVariants } from "@/lib/animationVariants";
import Loading from "../../loading";

export default function ShowNotes() {
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

  const filteredWords = words?.filter((w) => {
    return w.word.toLowerCase().trim().includes(search.toLowerCase().trim());
  });

  function updateSearch(word: string) {
    setSearch(word);
  }

  return (
    <>
      <SearchBar updateSearch={updateSearch} placeholder={'Search for words here...'}>
        <motion.p variants={itemVariants} className="mt-5" >
          This page is where all the words you have not learned yet are stored.
          Hence, if you have more spare time in the day you can review all the words
          here. <br /> <br />
          Bonus help: Press the F key to focus the search bar.
        </motion.p>
      </SearchBar>

      {filteredWords?.length === 0 && search != "" && (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      )}
      {!filteredWords && <Loading />}
      {filteredWords?.length != 0 && (
        <Words props={filteredWords} historyNote={false} rerenderParent={() => {}} drawerId={-1}/>
      )}
      {filteredWords?.length === 0 && search === "" && (
        <ZeroNotesMessage
          message={
            "Hmm, it looks like you're not learning any words right now. Time to learn!"
          }
        />
      )}
    </>
  );
}
