"use client";

import SearchBar from "@/components/common/SearchBar";
import { useEffect, useState } from "react";
import DrawerCreator from "./DrawerCreator";
import { TDrawer, TNoteApp } from "@/shared/types";
import Drawer from "./Drawer";
import Loading from "@/app/(ui)/loading";
import OpenedDrawer from "./OpenedDrawer";
import { AnimatePresence } from "framer-motion";

export default function ShowDrawersView({
  initialDrawers,
  initialNotes,
  drawerNoteMapping,
}: {
  initialDrawers: TDrawer[];
  initialNotes: TNoteApp[];
  drawerNoteMapping: { note_id: number, drawer_id: number }[];
}) {
  const [search, setSearch] = useState("");
  const [openedDrawerId, setOpenedDrawerId] = useState(-1);

  useEffect(() => {
    const drawerId = sessionStorage.getItem("openedDrawerId");
    if (drawerId != null && !isNaN(Number(drawerId))) {
      setOpenedDrawerId(Number(drawerId));
    }
  }, []);

  const openDrawerById = (id: number) => {
    sessionStorage.setItem("openedDrawerId", id.toString());
    setOpenedDrawerId(id);
  };

  let searchedDrawers = initialDrawers;
  if (openedDrawerId === -1) {
    searchedDrawers = initialDrawers.filter((d: TDrawer) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];
  }

  let notesOfOpenedDrawer = initialNotes;
  if (openedDrawerId !== -1) {
    notesOfOpenedDrawer = initialNotes.filter((n) => drawerNoteMapping.includes({ note_id: n.id, drawer_id: openedDrawerId }));
  }

  const openedDrawer = initialDrawers.find((d) => d.id === openedDrawerId);

  return (
    <>
      <SearchBar
        updateSearch={(e) => setSearch(e)}
        placeholder={
          openedDrawerId === -1
            ? "Search for drawers here..."
            : "Search for notes..."
        }
        sortBy={false} // hardcoded
        changeSortBy={() => { }} // needs updater function
      >
        <p className="pt-3 enter-fade-up enter-delay-1">
          {openedDrawerId === -1 ? (
            <>
              <b>
                This is where you can recall notes organized in your custom
                drawers.
              </b>
              <br />
              <br />
              You can add a drawer and delete it. Also you can add and remove
              notes from drawers.
              <br />
              <br />
              For example, you might have certain notes that you need for a
              field like business economy. In that case, you can create a drawer
              called &quot;business economy&quot; and store in it every word
              related to that topic.
              <br />
              <br />
              Bonus help: Press the F key to focus the search bar.
            </>
          ) : (
            <>
              Here are displayed only the notes that belong to a certain drawer.
              You can edit the notes for a word or you can remove the word from
              the drawer.
              <br /> <br />
              Bonus help: Press the F key to focus the search bar.
            </>
          )}
        </p>
      </SearchBar>

      {openedDrawerId === -1 ? (
        <DrawerCreator
          drawerNames={initialDrawers.map((d) => d.name)}
        />
      ) : null}

      {initialDrawers.length === 0 ? (
        <div className="box-layout mt-5 center enter-fade">
          <span className="text-box enter-fade-up enter-delay-1">
            No drawers created.
          </span>
        </div>
      ) : null}

      {openedDrawerId === -1 ? (
        searchedDrawers ? (
          searchedDrawers.length !== 0 ? (
            <AnimatePresence mode="popLayout">
              {searchedDrawers.map((d) => (
                <Drawer
                  key={d.id}
                  drawer={d}
                  notes={notesOfOpenedDrawer}
                  openDrawerById={(id: number) => openDrawerById(id)}
                  openedDrawerId={openedDrawerId}
                />
              ))}
            </AnimatePresence>
          ) : initialDrawers.length !== 0 ? (
            <div className="box-layout text-box mt-5 enter-fade">No drawers found.</div>
          ) : null
        ) : (
          <Loading />
        )
      ) : (
        // search is passed because when drawer is open search then searches for notes, not drawers
        <OpenedDrawer
          drawer={openedDrawer}
          drawerNotes={notesOfOpenedDrawer}
          search={search}
          openDrawerById={(id: number) => openDrawerById(id)}
          openedDrawerId={openedDrawerId}
          allNotes={initialNotes}
        />
      )}

      {initialDrawers === null || initialNotes === null ? <Loading /> : null}
    </>
  );
}
