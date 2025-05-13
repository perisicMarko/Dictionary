import { updateDrawerName } from "@/actions/manageNotes/manageDrawers";
import Loader from "@/components/common/Loader";
import { TokenContext } from "@/components/TokenContextProvider";
import { TDrawer } from "@/lib/types";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState, useContext, useEffect, useRef } from "react";

export default function UpdateForm({
  drawer, 
  updateFormShow,
  setUpdateFormShow,
  setAddFormShow,
}: {
  drawer: TDrawer;
  updateFormShow: boolean;
  setUpdateFormShow: (v: boolean) => void;
  setAddFormShow: (v: boolean) => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const tokenContext = useContext(TokenContext);
  const router = useRouter();
  const [refreshUponUpdate, setRefreshUponUpdate] = useState(false);
  const [stateDrawerName, setStateDrawerName] = useState(drawer?.name);
  const [updateState, updateAction, isUpdating] = useActionState(
    updateDrawerName,
    undefined
  );
  console.log(drawer);

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
    if (updateState?.success === false) {
      router.push("/");
    } else if (updateState?.success === true) {
      tokenContext?.setAccessToken(updateState.accessToken);
      setUpdateFormShow(false);
    }
    setRefreshUponUpdate(!refreshUponUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState?.success, isUpdating]);

  return (
    <form className="center-vertically gap-2 w-full" action={updateAction}>
      <input
        name="accessToken"
        value={tokenContext?.accessToken}
        readOnly
        hidden
      />
      <input name="drawerId" value={drawer?.id || -1} readOnly hidden />
      <div className="center py-1 px-2 border-1 border-white rounded-3xl w-full">
        <input
          ref={nameRef}
          name="drawerName"
          className={`transition-opacity text-start w-full text-white mt-5 inline-block outline-none active:outline-none ${
            drawer?.name ? "opacity-100" : "opacity-0"
          }`}
          defaultValue={drawer?.name}
          onChange={(e) => {
            setStateDrawerName(e.target.value);
          }}
          disabled={updateFormShow === false}
        />
        <Edit
          color="white"
          width={20}
          height={20}
          className="inline-block xl:hover:scale-105 cursor-pointer"
          onClick={() => {
            setUpdateFormShow(!updateFormShow);
            setAddFormShow(false);
          }}
        />
      </div>
      {updateFormShow && (
        <button
          type='submit'
          className={`w-full bg-blue-400 text-white rounded-3xl block p-2 cursor-pointer center xl:hover:scale-105 xl:active:scale-95
            ${(stateDrawerName === "" || stateDrawerName === drawer?.name) ? " opacity-50" : ""}`}
          disabled={stateDrawerName === "" || stateDrawerName === drawer?.name}
          onClick={() => drawer.name = stateDrawerName}
        >
          <span className="h-[20px] center">
            {isUpdating ? <Loader /> : "Update name"}
          </span>
        </button>
      )}
    </form>
  );
}
