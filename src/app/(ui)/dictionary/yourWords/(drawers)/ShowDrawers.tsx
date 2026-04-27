import SearchBar from "@/components/common/SearchBar";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { TokenContext } from "@/components/TokenContextProvider";
import AddDrawer from "./AddDrawer";
import { getUsersDrawers } from "@/features/drawers/application";
import { TDrawer, TNoteApp } from "@/lib/types";
import Drawer from "./Drawer";
import { getUsersNotes } from "@/features/notes/application";
import Loading from "@/app/(ui)/loading";
import OpenedDrawer from "./OpenedDrawer";
import { AnimatePresence } from "framer-motion";

export default function ShowDrawers() {
  const [search, setSearch] = useState("");
  const [drawers, setDrawers] = useState<TDrawer[]>();
  const [notes, setNotes] = useState<TNoteApp[]>();
  const [refresh, setRefresh] = useState(false);
  const [openedDrawerId, setOpenedDrawerId] = useState(-1);
  const tokenContext = useContext(TokenContext);

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
    const allNotes = await getUsersNotes(tokenContext?.accessToken || "");
    if (res) {
      tokenContext?.setAccessToken(res.accessToken);
      setDrawers(res.data);
    }
    if (allNotes) {
      tokenContext?.setAccessToken(allNotes.accessToken || "");
      setNotes(allNotes.data as TNoteApp[]);
    }
  };

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
            : "Search for notes..."
        }
        sortBy={false}
        changeSortBy={() => {}}
      >
        <motion.p variants={itemVariants} className="pt-3">
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
        </motion.p>
      </SearchBar>

      {openedDrawerId === -1 && <AddDrawer rerender={rerender} drawerNames={drawers?.map(d => d.name)} />}

      {drawers?.length === 0 && (
        <motion.div
          className="box-layout mt-5 center"
          variants={containerVariants}
        >
          <motion.span className="text-box" variants={itemVariants}>
            No drawers created.
          </motion.span>
        </motion.div>
      )}

      {openedDrawerId === -1 &&
        (searchedDrawers ? (
          searchedDrawers.length != 0 ? (
            <AnimatePresence mode="popLayout">
              {searchedDrawers?.map((d) => (
                <Drawer
                  key={d.id}
                  drawer={d as TDrawer}
                  notes={notes as TNoteApp[]}
                  rerender={rerender}
                  openDrawer={(id: number) => openDrawer(id)}
                  openedDrawerId={openedDrawerId}
                />
              ))}
            </AnimatePresence>
          ) : (
            drawers?.length != 0 && (
              <motion.div className="box-layout text-box mt-5">
                No drawers found.
              </motion.div>
            )
          )
        ) : (
          <Loading />
        ))}

      {openedDrawerId != -1 && (
        <OpenedDrawer
          drawer={openedDrawer}
          search={search}
          openDrawer={(id: number) => openDrawer(id)}
          openedDrawerId={openedDrawerId}
          allNotes={notes as TNoteApp[]}
        />
      )}
    </>
  );
}
