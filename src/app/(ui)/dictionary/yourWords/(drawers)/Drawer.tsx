import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { TDrawer, TNoteApp } from "@/lib/types";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState, useContext } from "react";
import DrawerMenu from "./DrawerMenu";
import UpdateForm from "./UpdateForm";
import AddNoteForm from "./AddNoteForm";
import { TokenContext } from "@/components/TokenContextProvider";
import { deleteDrawer } from "@/features/drawers/application";
import Loader from "@/components/common/Loader";

export default function Drawer({
  drawer,
  notes,
  rerender,
  openDrawer,
  openedDrawerId,
}: {
  drawer: TDrawer;
  notes: TNoteApp[];
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
    const res = await deleteDrawer(
      drawer?.id || -1,
      tokenContext?.accessToken || ""
    );
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
        layout="position"
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="box-layout mt-3 relative center-vertically"
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
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
            className="absolute z-20 bg-main rounded-3xl top-0 right-0 w-full h-full center-vertically"
          >
            <motion.h2 variants={itemVariants} className="text-box mb-3">
              Delete this drawer?
            </motion.h2>
            <div className="center gap-5">
              {isDeleting ? (
                <Loader />
              ) : (
                <>
                  <motion.span
                    className="text-text-main cursor-pointer hover:bg-second rounded-2xl py-1 px-2"
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
                    className="text-text-main cursor-pointer hover:bg-second rounded-2xl py-1 px-2"
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
                className="text-text-main mt-5 mb-2"
              >
                Add note
              </motion.span>
              {addFormShow === false ? (
                <motion.span
                  variants={itemVariants}
                  className="text-text-main xl:hover:text-text-second cursor-pointer transition-all duration-200"
                  title="Add word to drawer"
                >
                  <Plus
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddFormShow(true);
                    }}
                  />
                </motion.span>
              ) : (
                <AddNoteForm
                  notes={notes?.map((w: TNoteApp) => ({
                    word: w.dictionary_words.word,
                    noteId: w.id,
                  }))}
                  drawerId={drawer.id}
                  rerender={rerender}
                />
              )}
            </>
          )}
        </div>

        <span
          title={openedDrawerId === -1 ? "Open drawer" : "Close drawer"}
          className="text-text-main hover:text-text-second transition-all duration-200"
        >
          {openedDrawerId === -1 ? (
            <ChevronDown
              width={25}
              height={25}
              className="mt-3 cursor-pointer"
              onClick={() => openDrawer(drawer?.id || -1)}
            />
          ) : (
            <ChevronUp
              height={25}
              width={25}
              className="mt-3 cursor-pointer"
              onClick={() => openDrawer(-1)}
            />
          )}
        </span>
      </motion.div>
    </>
  );
}
