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
import Loader from "@/components/common/Loader";

export default function Drawer({
  drawer,
  words,
  rerender,
  openDrawer,
  openedDrawerId,
}: {
  drawer: TDrawer;
  words: TDBNoteEntry[];
  rerender: () => void;
  openDrawer: (id: number) => void;
  openedDrawerId: number;
}) {
  const [menu, setMenu] = useState(false);
  const [updateFormShow, setUpdateFormShow] = useState(false);
  const [addFormShow, setAddFormShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const tokenContext = useContext(TokenContext);

  const handleDelete = async () => {
    const res = await deleteDrawer(drawer?.id || -1, tokenContext?.accessToken || "");
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
        className="box-layout mt-3 relative transition-transform center-vertically"
        onClick={() => {
          setMenu(false);
          setAddFormShow(false);
        }}
      >
        {confirmDelete && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="absolute z-20 bg-slate-800 rounded-3xl top-0 right-0 w-full h-full center-vertically"
          >
            <motion.h2
              variants={itemVariants}
              className="text-box mb-3"
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
          drawerId={drawer?.id || -1}
          confirmDelete={deleteConfirmation}
          rerender={rerender}
        />
        <div className="center-vertically w-2/3 sm:w-1/2">
          <UpdateForm
            drawer={drawer}
            updateFormShow={updateFormShow}
            setUpdateFormShow={(v: boolean) => setUpdateFormShow(v)}
            setAddFormShow={(v: boolean) => setAddFormShow(v)}
          />
          {updateFormShow === false && (
            <>
              <motion.span
                variants={itemVariants}
                className="text-white mt-5 mb-2"
              >
                Add word
              </motion.span>
              {addFormShow === false ? (
                <motion.span
                  variants={itemVariants}
                  className="text-white xl:hover:text-blue-400 cursor-pointer"
                >
                  <Plus
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddFormShow(true);
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

        <span title={openedDrawerId === -1 ? 'Open drawer' : 'Close drawer'}>
          {openedDrawerId === -1 ? (
            <ChevronDown
              color="white"
              width={25}
              height={25}
              className="xl:hover:scale-105 mt-3 cursor-pointer"
              onClick={() => openDrawer(drawer?.id || -1)}
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
