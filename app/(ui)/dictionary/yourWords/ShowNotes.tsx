import { getUsersNotes } from "@/actions/manageNotes";
import Words from "@/components/common/Words";
import { TDBNoteEntry } from "@/lib/types";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import SearchBar, { SORT } from "@/components/common/SearchBar";
import { itemVariants } from "@/lib/animationVariants";
import Loading from "../../loading";
import { isBefore } from "date-fns";

export default function ShowNotes() {
  const [words, setWords] = useState<TDBNoteEntry[]>();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(-1);
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    const fetch = async () => {
      const words = await getUsersNotes(tokenContext?.accessToken || "");
      if (words) {
        setWords(words.data as TDBNoteEntry[]);
        tokenContext?.setAccessToken(words.accessToken || "");
      }
    };
    fetch();
  }, [tokenContext, tokenContext?.accessToken]);

  const filteredWords = words?.filter((w) => {
    return w.word.toLowerCase().trim().includes(search.toLowerCase().trim());
  });

  function updateSearch(word: string) {
    setSearch(word);
  }

  const sortedWords = filteredWords;
  if (sortBy != -1 && sortedWords != undefined) {
    switch (sortBy) {
      case SORT.BY_DATE_ASC:
        sortedWords.sort((e1, e2) => e1.id - e2.id);
        break;
      case SORT.BY_DATE_DESC:
        sortedWords.sort((e1, e2) => e2.id - e1.id);
        break;
      case SORT.BY_RECALL_DATE_ASC:
        sortedWords.sort((e1, e2) => {
          if (isBefore(e1.review_date, e2.review_date)) return -1;
          else return 1;
        });
        break;
      case SORT.BY_RECALL_DATE_DESC:
        sortedWords.sort((e1, e2) => {
          if (isBefore(e1.review_date, e2.review_date)) return 1;
          else return -1;
        });
        break;
    }
  }

  return (
    <>
      <SearchBar
        updateSearch={updateSearch}
        placeholder={"Search for words here..."}
        sortBy={true}
        changeSortBy={(arg: number) => setSortBy(arg)}
      >
        <motion.p variants={itemVariants} className="mt-5">
          This page is where all the words you have not learned yet are stored.
          Hence, if you have more spare time in the day you can review all the
          words here. <br /> <br />
          Bonus help: Press the F key to focus the search bar.
        </motion.p>
      </SearchBar>

      {filteredWords?.length === 0 && search != "" && (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      )}
      {!filteredWords && <Loading />}
      {sortedWords?.length != 0 && (
        <Words
          props={sortedWords}
          historyNote={false}
          rerenderParent={() => {}}
          drawerId={-1}
        />
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
