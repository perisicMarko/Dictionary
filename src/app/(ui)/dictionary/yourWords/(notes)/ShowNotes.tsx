"use client";

import { useMemo, useState } from "react";
import Words from "@/components/common/Words";
import { TNoteApp } from "@/shared/types";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import SearchBar, { SORT } from "@/components/common/SearchBar";
import Loading from "../../../loading";
import { isBefore } from "date-fns";

export default function ShowNotes({
  initialWords,
}: {
  initialWords: TNoteApp[] | null;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(-1);

  const sortedWords = useMemo(() => {
    if (!initialWords) {
      return undefined;
    }

    const searchedWords = initialWords.filter((w) => {
      return w.dictionary_words.word
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());
    });

    if (sortBy === -1) {
      return searchedWords;
    }

    const sorted = [...searchedWords];

    switch (sortBy) {
      case SORT.BY_DATE_ASC:
        sorted.sort((e1, e2) => e1.id - e2.id);
        break;
      case SORT.BY_DATE_DESC:
        sorted.sort((e1, e2) => e2.id - e1.id);
        break;
      case SORT.BY_RECALL_DATE_ASC:
        sorted.sort((e1, e2) =>
          isBefore(e1.review_date, e2.review_date) ? -1 : 1
        );
        break;
      case SORT.BY_RECALL_DATE_DESC:
        sorted.sort((e1, e2) =>
          isBefore(e1.review_date, e2.review_date) ? 1 : -1
        );
        break;
    }

    return sorted;
  }, [initialWords, search, sortBy]);

  function updateSearch(word: string) {
    setSearch(word);
  }

  return (
    <>
      <SearchBar
        updateSearch={updateSearch}
        placeholder={"Search for words here..."}
        sortBy={true}
        changeSortBy={(arg: number) => setSortBy(arg)}
      >
        <p className="mt-5 enter-fade-up enter-delay-1">
          This page is where all the words you have not learned yet are stored.
          Hence, if you have more spare time in the day you can review all the
          words here. <br /> <br />
          Bonus help: Press the F key to focus the search bar.
        </p>
      </SearchBar>

      {sortedWords?.length === 0 && search !== "" ? (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      ) : null}

      {sortedWords === undefined ? <Loading /> : null}

      {sortedWords && sortedWords.length !== 0 ? (
        <Words
          props={sortedWords}
          historyNote={false}
          rerenderParent={() => {}}
          drawerId={-1}
        />
      ) : null}

      {sortedWords?.length === 0 && search === "" ? (
        <ZeroNotesMessage
          message={
            "Hmm, seems like you're not learning any words yet. Time to get started!"
          }
        />
      ) : null}
    </>
  );
}
