import { getNotesOfDrawer } from "@/actions/manageNotes/manageDrawers";
import Loading from "@/app/(ui)/loading";
import Words from "@/components/common/Words";
import { TNoteApp, TDrawer } from "@/lib/types";
import { useEffect, useState } from "react";
import Drawer from "./Drawer";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function OpenedDrawer({
  drawer,
  search,
  openDrawer,
  openedDrawerId,
  allNotes,
}: {
  drawer: TDrawer | undefined;
  search: string;
  openDrawer: (id: number) => void;
  openedDrawerId: number;
  allNotes: TNoteApp[];
}) {
  const [drawerNotes, setDrawerNotes] = useState<TNoteApp[]>();
  const [refresh, setRefresh] = useState(false);
  const [isFetchingContent, setIsFetchingContent] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const data = await getNotesOfDrawer(drawer?.id || -1);
      setDrawerNotes(data as TNoteApp[]);
    };

    fetchWords();
    setIsFetchingContent(false);
  }, [drawer?.id, refresh]);

  const searchedWords = drawerNotes?.filter((w) =>
    w.dictionary_words.word.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <>
      {!drawer ? (
        <Loading />
      ) : isFetchingContent ? (
        <Loading />
      ) : (
        <>
          <Drawer
            key={drawer?.id}
            drawer={drawer as TDrawer}
            openDrawer={openDrawer}
            rerender={() => setRefresh(!refresh)}
            notes={allNotes}
            openedDrawerId={openedDrawerId}
          />
          {drawerNotes?.length === 0 ? (
            <motion.div
              className="mt-5 box-layout"
              variants={containerVariants}
            >
              <motion.p className="text-box" variants={itemVariants}>
                This drawer is empty.
              </motion.p>
            </motion.div>
          ) : (
            <Words
              props={searchedWords}
              historyNote={false}
              rerenderParent={() => {
                setRefresh(!refresh);
              }}
              drawerId={drawer?.id || -1}
            />
          )}
        </>
      )}
    </>
  );
}
