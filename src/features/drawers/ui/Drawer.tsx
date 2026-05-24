"use client";

import { TDrawer, TNoteApp } from "@/shared/types";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import UpdateDrawerNameForm from "./UpdateDrawerNameForm";
import DrawerNotePicker from "./DrawerNotePicker";
import { deleteDrawer } from "@/features/drawers/application";
import Loader from "@/reusableComponents/Loader";
import { useRouter } from "next/navigation";

export default function Drawer({
  drawer,
  allNotes,
  openDrawerById,
  isDrawerOpened,
  drawerNotes,
  onDeleted,
}: {
  drawer: TDrawer;
  allNotes: TNoteApp[];
  openDrawerById: (id: number) => void;
  isDrawerOpened: boolean;
  drawerNotes: TNoteApp[];
  onDeleted?: (drawerId: number) => void;
}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [updateFormShow, setUpdateFormShow] = useState(false);
  const [addFormShow, setAddFormShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await deleteDrawer(drawer.id);

    if (onDeleted) {
      onDeleted(drawer.id);
      setIsDeleting(false);
      return;
    }

    router.refresh();
    setIsDeleting(false);
  };

  const deleteConfirmation = (v: boolean) => {
    setConfirmDelete(v);
  };

  return (
    <div
      className="box-layout mt-3 relative center-vertically enter-fade"
      onClick={() => {
        setIsMenuOpened(false);
        setAddFormShow(false);
      }}
    >
      {confirmDelete ? (
        <div className="absolute z-20 bg-main rounded-3xl top-0 right-0 w-full h-full center-vertically enter-fade">
          <h2 className="text-box mb-3 enter-fade-up enter-delay-1">
            {`Delete ${drawer.name} drawer?`}
          </h2>
          <div className="center gap-5">
            {isDeleting ? (
              <Loader />
            ) : (
              <>
                <span
                  className="text-text-main cursor-pointer hover:bg-second rounded-2xl py-2 px-5 enter-fade-up enter-delay-1"
                  onClick={async () => {
                    setIsDeleting(true);
                    await handleDelete();
                    setConfirmDelete(false);
                  }}
                >
                  Yes
                </span>
                <span
                  className="text-text-main cursor-pointer hover:bg-second rounded-2xl py-2 px-5 enter-fade-up enter-delay-1"
                  onClick={() => {
                    setConfirmDelete(false);
                  }}
                >
                  No
                </span>
              </>
            )}
          </div>
        </div>
      ) : null}

      <DrawerMenu
        isOpened={isMenuOpened}
        toggleMenu={() => {
          setIsMenuOpened(!isMenuOpened);
        }}
        drawerId={drawer?.id || -1}
        confirmDelete={deleteConfirmation}
      />

      <div className="center-vertically w-2/3 sm:w-1/2">
        <UpdateDrawerNameForm
          drawer={drawer}
          updateFormShow={updateFormShow}
          setUpdateFormShow={(v: boolean) => setUpdateFormShow(v)}
          setAddFormShow={(v: boolean) => setAddFormShow(v)}
        />
        {updateFormShow === false ? (
          <>
            <span className="text-text-main mt-5 mb-2 enter-fade-up enter-delay-1">
              Add note
            </span>
            {addFormShow === false ? (
              <span
                className="text-text-main hover:text-text-second cursor-pointer transition-all duration-200 enter-fade-up enter-delay-1"
                title="Add word to drawer"
              >
                <Plus
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddFormShow(true);
                  }}
                />
              </span>
            ) : (
              <DrawerNotePicker
                notes={allNotes?.map((w: TNoteApp) => ({
                  word: w.dictionary_words.word,
                  noteId: w.id,
                }))}
                drawerId={drawer.id}
              />
            )}
          </>
        ) : null}
      </div>

      <span
        title={!isDrawerOpened ? "Open drawer" : "Close drawer"}
        className="text-text-main hover:text-text-second transition-colors"
      >
        {!isDrawerOpened ? (
          <ChevronDown
            width={25}
            height={25}
            className="mt-3 cursor-pointer"
            onClick={() => openDrawerById(drawer.id)}
          />
        ) : (
          <ChevronUp
            height={25}
            width={25}
            className="mt-3 cursor-pointer"
            onClick={() => openDrawerById(-1)}
          />
        )}
      </span>
    </div>
  );
}
