import { getUsersWords } from "@/features/notes/application";
import Words from "@/components/common/Words";
import { TNoteApp } from "@/lib/types";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import SearchBar, { SORT } from "@/components/common/SearchBar";
import { itemVariants } from "@/lib/animationVariants";
import Loading from "../../loading";
import { isBefore } from "date-fns";

export default function ShowNotes() {
  const [words, setWords] = useState<TNoteApp[] | undefined>();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(-1);

  useEffect(() => {
    const fetch = async () => {
      const words = await getUsersWords();
      if (words) {
        setWords(words.data);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSearch(word: string) {
    setSearch(word);
  }

  function sortWordsByFilter() {
    const searchedWords = words?.filter((w) => {
      return w.dictionary_words.word
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());
    });
    if (sortBy != -1 && searchedWords != undefined) {
      switch (sortBy) {
        case SORT.BY_DATE_ASC:
          searchedWords.sort((e1, e2) => e1.id - e2.id);
          break;
        case SORT.BY_DATE_DESC:
          searchedWords.sort((e1, e2) => e2.id - e1.id);
          break;
        case SORT.BY_RECALL_DATE_ASC:
          searchedWords.sort((e1, e2) =>
            isBefore(e1.review_date, e2.review_date) ? -1 : 1
          );
          break;
        case SORT.BY_RECALL_DATE_DESC:
          searchedWords.sort((e1, e2) =>
            isBefore(e1.review_date, e2.review_date) ? 1 : -1
          );
          break;
      }
    }
    return searchedWords;
  }

  const sortedWords = sortWordsByFilter();

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

      {sortedWords?.length === 0 && search != "" && (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      )}
      {!sortedWords && <Loading />}
      {sortedWords?.length != 0 && (
        <Words
          props={sortedWords}
          historyNote={false}
          rerenderParent={() => {}}
          drawerId={-1}
        />
      )}
      {sortedWords?.length === 0 && search === "" && (
        <ZeroNotesMessage
          message={
            "Hmm, seems like you're not learning any words yet. Time to get started!"
          }
        />
      )}
    </>
  );
}
