import Loading from "@/app/(ui)/loading";
import Words from "@/components/common/Words";
import { TNoteApp, TDrawer } from "@/shared/types";
import Drawer from "./Drawer";

export default function OpenedDrawer({
  drawer,
  drawerNotes,
  search,
  openDrawer,
  openedDrawerId,
  allNotes,
  rerender,
}: {
  drawer: TDrawer | undefined;
  drawerNotes: TNoteApp[] | null;
  search: string;
  openDrawer: (id: number) => void;
  openedDrawerId: number;
  allNotes: TNoteApp[];
  rerender: () => void;
}) {
  const searchedWords =
    drawerNotes?.filter((w) =>
      w.dictionary_words.word.toLowerCase().includes(search.toLowerCase().trim())
    ) ?? [];

  if (!drawer || drawerNotes === null) {
    return <Loading />;
  }

  return (
    <>
      <Drawer
        key={drawer.id}
        drawer={drawer}
        openDrawer={openDrawer}
        rerender={rerender}
        notes={allNotes}
        openedDrawerId={openedDrawerId}
      />
      {drawerNotes.length === 0 ? (
        <div className="mt-5 box-layout enter-fade">
          <p className="text-box enter-fade-up enter-delay-1">
            This drawer is empty.
          </p>
        </div>
      ) : searchedWords.length === 0 ? (
        <div className="box-layout mt-5 text-box enter-fade">No words found.</div>
      ) : (
        <Words
          props={searchedWords}
          historyNote={false}
          rerenderParent={rerender}
          drawerId={drawer.id}
        />
      )}
    </>
  );
}
