"use client";

import SearchBar from "@/components/common/SearchBar";
import { useEffect, useState } from "react";
import DrawerCreator from "./DrawerCreator";
import { getNotesOfDrawer } from "@/features/drawers/application";
import { TDrawer, TNoteApp } from "@/shared/types";
import Drawer from "./Drawer";
import Loading from "@/app/(ui)/loading";
import OpenedDrawer from "./OpenedDrawer";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function ShowDrawersView({
  initialDrawers,
  initialNotes,
  isAuthenticated,
}: {
  initialDrawers: TDrawer[];
  initialNotes: TNoteApp[];
  isAuthenticated: boolean;
}) {
  const [search, setSearch] = useState("");
  const [drawers, setDrawers] = useState<TDrawer[] | null>(initialDrawers);
  const [notes, setNotes] = useState<TNoteApp[] | null>(initialNotes);
  const [openedDrawerNotes, setOpenedDrawerNotes] = useState<TNoteApp[] | null>(null);
  const [openedDrawerId, setOpenedDrawerId] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const drawerId = sessionStorage.getItem("openedDrawerId");
    if (drawerId != null && !isNaN(Number(drawerId))) {
      setOpenedDrawerId(Number(drawerId));
    }
  }, [isAuthenticated, router]);

  const openDrawer = (id: number) => {
    sessionStorage.setItem("openedDrawerId", id.toString());
    setOpenedDrawerId(id);
  };

  const loadOpenedDrawerNotes = async (drawerId: number) => {
    if (drawerId === -1) {
      setOpenedDrawerNotes(null);
      return true;
    }

    const notesRes = await getNotesOfDrawer(drawerId);
    if (!notesRes.success) {
      router.push("/login");
      return false;
    }

    setOpenedDrawerNotes(notesRes.data as TNoteApp[]);
    return true;
  };

  useEffect(() => {
    void loadOpenedDrawerNotes(openedDrawerId);
  }, [openedDrawerId]);

  function updateSearch(word: string) {
    setSearch(word);
  }

  async function rerender() {
    router.refresh();
    if (openedDrawerId === -1) {
      return;
    }

    await loadOpenedDrawerNotes(openedDrawerId);
  }

  let searchedDrawers = drawers;

  if (openedDrawerId === -1) {
    searchedDrawers = drawers?.filter((d: TDrawer) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];
  }

  const openedDrawer = drawers?.find((d) => d.id === openedDrawerId);

  return (
    <>
      <SearchBar
        updateSearch={updateSearch}
        placeholder={
          openedDrawerId === -1
            ? "Search for drawers here..."
            : "Search for notes..."
        }
        sortBy={false}
        changeSortBy={() => {}}
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
          rerender={rerender}
          drawerNames={drawers?.map((d) => d.name)}
        />
      ) : null}

      {drawers?.length === 0 ? (
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
                  notes={(notes ?? []) as TNoteApp[]}
                  rerender={rerender}
                  openDrawer={(id: number) => openDrawer(id)}
                  openedDrawerId={openedDrawerId}
                />
              ))}
            </AnimatePresence>
          ) : drawers && drawers.length !== 0 ? (
            <div className="box-layout text-box mt-5 enter-fade">No drawers found.</div>
          ) : null
        ) : (
          <Loading />
        )
      ) : (
        <OpenedDrawer
          drawer={openedDrawer}
          drawerNotes={openedDrawerNotes}
          search={search}
          openDrawer={(id: number) => openDrawer(id)}
          openedDrawerId={openedDrawerId}
          allNotes={(notes ?? []) as TNoteApp[]}
          rerender={rerender}
        />
      )}

      {drawers === null || notes === null ? <Loading /> : null}
    </>
  );
}
