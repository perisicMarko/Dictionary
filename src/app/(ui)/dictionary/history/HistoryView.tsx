"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../../../components/common/SearchBar";
import Notes from "@/components/common/Notes";
import { TNoteApp } from "@/shared/types";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";

export default function HistoryView({
  initialWords,
}: {
  initialWords: TNoteApp[];
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredWords = useMemo(() => {
    return initialWords.filter((w) => {
      return w.dictionary_words.word
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());
    });
  }, [initialWords, search]);

  function updateSearch(word: string) {
    setSearch(word);
  }

  return (
    <>
      <div className="mt-12 w-full center-vertically">
        <SearchBar
          updateSearch={updateSearch}
          placeholder={"Search for notes here..."}
          sortBy={false}
          changeSortBy={() => {}}
        >
          <p className="mt-6 enter-fade-up enter-delay-1 text-justify">
            This page should help you review the words you have learned. So
            basically this page just stores learned words, like personal history.
            <br />
            <br />
            In the menu, there are a delete icon for permanent word deletion and
            &quot;R&quot; for relearning the word.
            From this page, and this page only you can delete a note permanently or
            return word to the learning process.
            <br />
            <br />
            Bonus help: Press the F key to focus the search bar.
          </p>
        </SearchBar>
      </div>

      {filteredWords.length === 0 && search !== "" ? (
        <ZeroNotesMessage
          message={"There is no word like that within your words."}
        />
      ) : null}

      {filteredWords.length !== 0 ? (
        <Notes
          notes={filteredWords}
          isHistoryNote={true}
          drawerId={-1}
        />
      ) : null}

      {filteredWords.length === 0 && search === "" ? (
        <ZeroNotesMessage
          message={
            "Hmm, it looks like you haven’t marked any words as learned yet."
          }
        />
      ) : null}
    </>
  );
}
