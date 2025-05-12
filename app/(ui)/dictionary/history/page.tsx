"use client";
import { SearchBar } from "../../../../components/common/SearchBar";
import { getUsersHistory } from "@/actions/manageNotes";
import Words from "@/components/common/Words";
import { TDBNoteEntry } from "@/lib/types";
import { useState, useContext, useEffect } from "react";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import { itemVariants } from "@/lib/animationVariants";
import { motion } from "framer-motion";
import Loading from "../../loading";

export default function History() {
  const tokenContext = useContext(TokenContext);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      const words = await getUsersHistory(tokenContext?.accessToken || "");
      if(words){
        setWords(words?.data);
        tokenContext?.setAccessToken(words.accessToken || '');
      }
    };
    fetch();
  }, [tokenContext?.accessToken, refresh, tokenContext]);

  const filteredWords =
    words?.filter((w) => {
      return w.word.toLowerCase().trim().includes(search.toLowerCase().trim());
    });

  function updateSearch(word: string) {
    setSearch(word);
  }

  return (
    <>
      <div className="mt-15 w-full center-vertically">
        <SearchBar updateSearch={updateSearch} placeholder={'Search for notes here...'}>
          <motion.p variants={itemVariants} className="pt-3">
            In menu, there is a delete icon for permanent word deletion and
            &quot;R&quot; for relearning the word.
            <br />
            This page should help you review the words you have learned. So
            basically this page just stores learned words, like personal history.
            <br />
            <br />
            From this page, and this page only you can delete a note permanently or
            return word to the learning process. <br />
            <br /><br />
            Bonus help: Press the F key to focus the search bar.
          </motion.p>
        </SearchBar>
      </div>

      {filteredWords?.length === 0 && search != "" && (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      )}
      {!filteredWords && <Loading />}
      {filteredWords?.length != 0 && (
        <Words props={filteredWords} historyNote={false} rerenderParent={() => {setRefresh(!refresh)}} drawerId={-1} />
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
