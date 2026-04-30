import Loading from "@/app/(ui)/loading";
import Notes from "@/components/common/Notes";
import { TNoteApp, TDrawer } from "@/shared/types";
import Drawer from "./Drawer";

export default function OpenedDrawer({
  drawer,
  drawerNotes,
  search,
  openDrawerById,
  allNotes,
}: {
  drawer: TDrawer;
  drawerNotes: TNoteApp[];
  search: string;
  openDrawerById: (id: number) => void;
  allNotes: TNoteApp[]; // todo: remove this when notes start to show in openedDrawer
}) {
  const searchedWords =
    drawerNotes.filter((w) =>
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
        notes={allNotes}
        openDrawerById={(id : number) => openDrawerById(id)}
        isDrawerOpened={true}
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
        <Notes
          notes={searchedWords}
          isHistoryNote={false}
          drawerId={drawer.id}
        />
      )}
    </>
  );
}
