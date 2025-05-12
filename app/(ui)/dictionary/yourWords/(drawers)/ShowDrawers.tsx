import { SearchBar } from "@/components/common/SearchBar";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animationVariants";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { TokenContext } from "@/components/TokenContextProvider";
import AddDrawer from "./AddDrawer";
import { getUsersDrawers } from "@/actions/manageNotes/manageDrawers";
import { TDBNoteEntry, TDrawer } from "@/lib/types";
import Drawer from "./Drawer";
import { getUsersNotes } from "@/actions/manageNotes";
import Loading from "@/app/(ui)/loading";
import OpenDrawer from "./OpenedDrawer";

export default function ShowDrawers() {
  const [search, setSearch] = useState("");
  const tokenContext = useContext(TokenContext);
  const [drawers, setDrawers] = useState<TDrawer[]>();
  const [words, setWords] = useState<TDBNoteEntry[]>();
  const [refresh, setRefresh] = useState(false);
  const [openedDrawerId, setOpenedDrawerId] = useState(-1);

  useLayoutEffect(() => {
    const drawerId = sessionStorage.getItem("openedDrawerId");
    if (drawerId != null && !isNaN(Number(drawerId)))
      setOpenedDrawerId(Number(drawerId));
  }, []);

  const openDrawer = (id: number) => {
    sessionStorage.setItem("openedDrawerId", id.toString());
    setOpenedDrawerId(id);
  };

  const fetch = async () => {
    const res = await getUsersDrawers(tokenContext?.accessToken || "");
    const allWords = await getUsersNotes(tokenContext?.accessToken || "");
    if (res) {
      tokenContext?.setAccessToken(res.accessToken);
      setDrawers(res.data);
    }
    if (allWords) {
      tokenContext?.setAccessToken(allWords.accessToken || "");
      setWords(allWords.data);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  function updateSearch(word: string) {
    setSearch(word);
  }

  function rerender() {
    setRefresh(!refresh);
  }

  let searchedDrawers = drawers;

  if (openedDrawerId === -1) {
    searchedDrawers = drawers?.filter((d: TDrawer) => {
      if (d.name.toLowerCase().includes(search.toLowerCase())) return d;
    });
  }

  const openedDrawer = drawers?.find((d) => d.id === openedDrawerId);

  return (
    <>
      <SearchBar
        updateSearch={updateSearch}
        placeholder={
          openedDrawerId === -1
            ? "Search for drawers here..."
            : "Search for words..."
        }
      >
        <motion.p variants={itemVariants} className="pt-3">
          {openedDrawerId === -1 ? (
            <>
              <b>
                This is where you can recall words organized in your custom
                drawers.
              </b>
              <br />
              <br />
              You can add a drawer and delete it. Also you can add and remove
              words from drawers.
              <br />
              <br />
              For example, you might have certain words that you need for a
              field like business economy. In that case, you can create a drawer
              called &quot;business economy&quot; and store in it every word
              related to that topic.
              <br />
              <br />
              Bonus help: Press the F key to focus the search bar.
            </>
          ) : (
            <>
              Here are displayed only the words that belong to a certain drawer.
              You can edit the notes for a word or you can remove the word from
              the drawer.
              <br /> <br />
              Bonus help: Press the F key to focus the search bar.
            </>
          )}
        </motion.p>
      </SearchBar>

      {openedDrawerId === -1 && <AddDrawer fetch={() => fetch()} />}

      {openedDrawerId === -1 &&
        (drawers ? (
          searchedDrawers?.map((d) => (
            <Drawer
              key={d.id}
              drawer={d as TDrawer}
              words={words}
              rerender={rerender}
              openDrawer={(id: number) => openDrawer(id)}
              openedDrawerId={openedDrawerId}
            />
          ))
        ) : (
          <Loading />
        ))}

      {openedDrawerId != -1 && (
        <OpenDrawer
          drawer={openedDrawer}
          search={search}
          openDrawer={(id: number) => openDrawer(id)}
          openedDrawerId={openedDrawerId}
          allWords={words}
        />
      )}
    </>
  );
}
