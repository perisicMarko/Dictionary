"use client";

import { useMemo, useState } from "react";
import { TNoteApp } from "@/shared/types";
import ZeroNotesMessage from "@/features/notes/ui/ZeroNotesMessage";
import SearchBar, { SORT } from "@/reusableComponents/SearchBar";
import { isBefore } from "date-fns";
import Notes from "@/features/notes/ui/Notes";

export default function ShowNotesView({
  initialNotes,
}: {
  initialNotes: TNoteApp[];
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(-1);

  const sortednotes = useMemo(() => {
    if (!initialNotes) {
      return undefined;
    }

    const searchednotes = initialNotes.filter((w) => {
      return w.dictionary_words.word
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());
    });

    if (sortBy === -1) {
      return searchednotes;
    }

    const sorted = [...searchednotes];

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
  }, [initialNotes, search, sortBy]);

  function updateSearch(note: string) {
    setSearch(note);
  }

  return (
    <>
      <SearchBar
        updateSearch={updateSearch}
        placeholder={"Search for notes here..."}
        sortBy={true}
        changeSortBy={(arg: number) => setSortBy(arg)}
      >
        <p className="enter-fade-up enter-delay-1 text-justify text-text-main mt-7">
          This page is where all the notes you have not learned yet are stored.
          Hence, if you have more spare time in the day you can review all the
          notes here. <br /> <br />
          Bonus help: Press the F key to focus the search bar.
        </p>
      </SearchBar>

      {sortednotes?.length === 0 && search !== "" ? (
        <ZeroNotesMessage
          message={"There is no note like that within your notes."}
        />
      ) : null}

      {sortednotes && sortednotes.length !== 0 ? (
        <Notes
          notes={sortednotes}
          isHistoryNote={false}
          drawerId={-1}
        />
      ) : null}

      {sortednotes?.length === 0 && search === "" ? (
        <ZeroNotesMessage
          message={
            "Hmm, seems like you're not learning any notes yet. Time to get started!"
          }
        />
      ) : null}
    </>
  );
}
