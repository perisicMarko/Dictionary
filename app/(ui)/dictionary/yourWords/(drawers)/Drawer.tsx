import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { TDBNoteEntry, TDrawer } from "@/lib/types";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState, useContext } from "react";
import DrawerMenu from "./DrawerMenu";
import UpdateForm from "./UpdateForm";
import AddWordForm from "./AddWordForm";
import { TokenContext } from "@/components/TokenContextProvider";
import { deleteDrawer } from "@/actions/manageNotes/manageDrawers";
import Loader from "@/components/Loader";

export default function Drawer({
  drawer,
  words,
  rerender,
  openDrawer,
  openedDrawerId,
}: {
  drawer: TDrawer;
  words: TDBNoteEntry[] | undefined;
  rerender: () => void;
  openDrawer: (id: number) => void;
  openedDrawerId: number;
}) {
  const [menu, setMenu] = useState(false);
  const [updateDrop, setUpdateDrop] = useState(false);
  const [addDrop, setAddDrop] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const tokenContext = useContext(TokenContext);

  const handleDelete = async () => {
    const res = await deleteDrawer(drawer?.id, tokenContext?.accessToken || "");
    if (!res?.success) tokenContext?.setAccessToken("");
    else if (res.success && res.accessToken)
      tokenContext?.setAccessToken(res?.accessToken);

    rerender();
    setIsDeleting(false);
  };

  const deleteConfirmation = (v: boolean) => {
    setConfirmDelete(v);
  };


  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="appWidth bg-slate-800 mt-5 rounded-3xl p-3 relative transition-transform flex flex-col justify-center items-center"
        onClick={() => {
          setMenu(false);
          setAddDrop(false);
        }}
        hidden={openedDrawerId != -1 && openedDrawerId != drawer.id} // more convinient approach do not fetch everything again just hide drawers that are not opened
      >
        {confirmDelete && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="absolute z-20 bg-slate-800 rounded-3xl top-0 right-0 w-full h-full flex flex-col justify-center items-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-white text-center mb-3"
            >
              Delete this drawer?
            </motion.h2>
            <div className="center gap-5">
              {isDeleting ? (
                <Loader />
              ) : (
                <>
                  <motion.span
                    className="text-white cursor-pointer hover:bg-blue-400 rounded-2xl py-1 px-2"
                    variants={itemVariants}
                    onClick={async () => {
                      setIsDeleting(true);
                      await handleDelete();
                      setConfirmDelete(false);
                    }}
                  >
                    Yes
                  </motion.span>
                  <motion.span
                    className="text-white cursor-pointer hover:bg-blue-400 rounded-2xl py-1 px-2"
                    variants={itemVariants}
                    onClick={() => {
                      setConfirmDelete(false);
                    }}
                  >
                    No
                  </motion.span>
                </>
              )}
            </div>
          </motion.div>
        )}
        <DrawerMenu
          menu={menu}
          toggleMenu={() => {
            setMenu(!menu);
          }}
          drawerId={drawer.id}
          confirmDelete={deleteConfirmation}
          rerender={rerender}
        />
        <div className="flex flex-col justify-center items-center w-1/2">
          <UpdateForm
            updateDrop={updateDrop}
            setUpdateDrop={(v: boolean) => setUpdateDrop(v)}
            setAddDrop={(v: boolean) => setAddDrop(v)}
            drawerId={drawer?.id}
          />
          {updateDrop === false && (
            <>
              <motion.span
                variants={itemVariants}
                className="text-white mt-5 mb-2"
              >
                Add word
              </motion.span>
              {addDrop === false ? (
                <motion.span
                  variants={itemVariants}
                  className="text-white xl:hover:text-blue-400 cursor-pointer"
                >
                  <Plus
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddDrop(true);
                    }}
                  />
                </motion.span>
              ) : (
                <AddWordForm
                  words={words?.map((w: TDBNoteEntry) => ({
                    word: w.word,
                    wordId: w.id,
                  }))}
                  drawerId={drawer.id}
                  rerender={rerender}
                />
              )}
            </>
          )}
        </div>

        <span title={openedDrawerId === -1 ? 'Open drawer' : 'CloseDrawer'}>
          {openedDrawerId === -1 ? (
            <ChevronDown
              color="white"
              width={25}
              height={25}
              className="xl:hover:scale-105 mt-3 cursor-pointer"
              onClick={() => openDrawer(drawer.id)}
            />
          ) : (
            <ChevronUp
              color="white"
              height={25}
              width={25}
              className="xl:hover:scale-105 mt-3 cursor-pointer"
              onClick={() => openDrawer(-1)}
            />
          )}
        </span>
      </motion.div>
    </>
  );
}
