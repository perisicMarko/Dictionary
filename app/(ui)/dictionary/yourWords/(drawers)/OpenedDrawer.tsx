import { getWordsOfDrawer } from "@/actions/manageNotes/manageDrawers";
import Loading from "@/app/(ui)/loading";
import Words from "@/components/Words";
import { TDBNoteEntry, TDrawer } from "@/lib/types";
import { useEffect, useState } from "react";
import Drawer from "./Drawer";

export default function OpenDrawer({
  drawer,
  search,
  openDrawer,
  openedDrawerId,
  allWords,
}: {
  drawer: TDrawer | undefined;
  search: string;
  openDrawer: (v: number) => void;
  openedDrawerId: number;
  allWords: TDBNoteEntry[] | undefined;
}) {
  const [words, setWords] = useState<TDBNoteEntry[]>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      const data = await getWordsOfDrawer(drawer?.id || -1);
      setWords(data);
    };

    fetchWords();
  }, [drawer?.id, refresh]);

  const searchedWords = words?.filter((w) => {
    if (w.word.toLowerCase().includes(search)) return w;
  });

  return (
    <>
      <Drawer
        key={drawer?.id}
        drawer={drawer as TDrawer}
        openDrawer={openDrawer}
        rerender={() => setRefresh(!refresh)}
        words={allWords}
        openedDrawerId={openedDrawerId}
      />
      {words ? (
        <Words
          props={searchedWords}
          historyNote={false}
          handle={() => {
            setRefresh(!refresh);
          }}
          drawerId={drawer?.id || -1}
        />
      ) : (
        <Loading />
      )}
    </>
  );
}
