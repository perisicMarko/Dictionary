import {
  getDrawerById,
  updateDrawerName,
} from "@/actions/manageNotes/manageDrawers";
import Loader from "@/components/common/Loader";
import { TokenContext } from "@/components/TokenContextProvider";
import { TDrawer } from "@/lib/types";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState, useContext, useEffect, useRef } from "react";

export default function UpdateForm({
  updateDrop,
  setUpdateDrop,
  setAddDrop,
  drawerId,
}: {
  updateDrop: boolean;
  setUpdateDrop: (v: boolean) => void;
  setAddDrop: (v: boolean) => void;
  drawerId: number;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const tokenContext = useContext(TokenContext);
  const router = useRouter();
  const [refreshUponUpdate, setRefreshUponUpdate] = useState(false);
  const [drawer, setDrawer] = useState<TDrawer | undefined | null>();
  const [stateDrawerName, setStateDrawerName] = useState(drawer?.name);
  const [updateState, updateAction, isUpdating] = useActionState(
    updateDrawerName,
    undefined
  );

  const fetchDrawer = async () => {
    const d = await getDrawerById(drawerId);
    setDrawer(d);
  };

  useEffect(() => {
    fetchDrawer();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUponUpdate]);

  useEffect(() => {
    const length = drawer?.name.length;
    if (updateDrop && nameRef.current && length) {
      // move the cursor to the end of the drawer name
      nameRef.current.setSelectionRange(length, length);
      nameRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDrop]);

  useEffect(() => {
    if (updateState?.success === false) {
      router.push("/");
    } else if (updateState?.success === true) {
      tokenContext?.setAccessToken(updateState.accessToken);
      setUpdateDrop(false);
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
          disabled={updateDrop === false}
        />
        <Edit
          color="white"
          width={20}
          height={20}
          className="inline-block xl:hover:scale-105 cursor-pointer"
          onClick={() => {
            setUpdateDrop(!updateDrop);
            setAddDrop(false);
          }}
        />
      </div>
      {updateDrop && (
        <button
          className={`w-full bg-blue-400 text-white rounded-3xl block p-2 cursor-pointer center xl:hover:scale-105 xl:active:scale-95
            ${stateDrawerName === "" && " opacity-50"}`}
          disabled={stateDrawerName === ""}
        >
          <span className="h-[20px] center">
            {isUpdating ? <Loader /> : "Update name"}
          </span>
        </button>
      )}
    </form>
  );
}
