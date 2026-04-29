import { updateDrawerName } from "@/features/drawers/application";
import Loader from "@/components/common/Loader";
import { TDrawer } from "@/shared/types";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

export default function UpdateForm({
  drawer, 
  updateFormShow,
  setUpdateFormShow,
  setAddFormShow,
  rerender,
}: {
  drawer: TDrawer;
  updateFormShow: boolean;
  setUpdateFormShow: (v: boolean) => void;
  setAddFormShow: (v: boolean) => void;
  rerender: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [stateDrawerName, setStateDrawerName] = useState(drawer?.name);
  const [updateState, updateAction, isUpdating] = useActionState(
    updateDrawerName,
    undefined
  );

  useEffect(() => {
    setStateDrawerName(drawer.name);
  }, [drawer.name]);

  useEffect(() => {
    const length = drawer?.name.length;
    if (updateFormShow && nameRef.current && length) {
      // move the cursor to the end of the drawer name
      nameRef.current.setSelectionRange(length, length);
      nameRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFormShow]);

  useEffect(() => {
    if (!updateState) {
      return;
    }

    if (!updateState.success) {
      router.push("/login");
      return;
    }

    setUpdateFormShow(false);
    rerender();
  }, [updateState, rerender, router, setUpdateFormShow]);

  const drawerNameValue = updateFormShow ? stateDrawerName : drawer?.name;
  const isInvalidDrawerName =
    stateDrawerName.trim() === "" || stateDrawerName === drawer?.name;

  return (
    <form className="center-vertically gap-2 w-full" action={updateAction}>
      <input name="drawerId" value={drawer?.id || -1} readOnly hidden />
      <div className="center py-1 px-2 border-1 border-white rounded-3xl w-full">
        <input
          ref={nameRef}
          name="drawerName"
          className={`transition-opacity text-start w-full text-text-main mt-5 inline-block outline-none active:outline-none ${
            drawer?.name ? "opacity-100" : "opacity-0"
          }`}
          value={drawerNameValue}
          onChange={(e) => {
            setStateDrawerName(e.target.value);
          }}
          disabled={updateFormShow === false}
        />
        <span title='Edit drawer name' className="text-text-main hover:text-text-second transition-all duration-200">
            <Edit
              width={20}
              height={20}
              className="inline-block cursor-pointer"
              onClick={() => {
                setUpdateFormShow(!updateFormShow);
                setAddFormShow(false);
              }}
            />
          </span>
      </div>
      {updateFormShow && (
        <button
          type='submit'
          className={`w-full bg-second text-text-main rounded-3xl block p-2 cursor-pointer center xl:hover:scale-105 xl:active:scale-95 transition-all
            ${(isInvalidDrawerName ? " opacity-50" : "")}`}
          disabled={isInvalidDrawerName || isUpdating}
        >
          <span className="h-[20px] center">
            {isUpdating ? <Loader /> : "Update name"}
          </span>
        </button>
      )}
    </form>
  );
}
