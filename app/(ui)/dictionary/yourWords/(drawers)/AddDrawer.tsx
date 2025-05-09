import { motion } from "framer-motion";
import { useState, useContext, useActionState, useEffect, useRef } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { Plus } from "lucide-react";
import { createDrawer } from "@/actions/manageNotes/manageDrawers";
import { TokenContext } from "@/components/TokenContextProvider";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function AddDrawer({fetch} : {fetch : () => void}) {
  const [addDrawer, setAddDrawer] = useState(false);
  const [state, action, isPending] = useActionState(createDrawer, undefined);
  const [drawerName, setDrawerName] = useState("");
  const drawerAddRef = useRef<HTMLInputElement>(null);
  const tokenContext = useContext(TokenContext);
  const router = useRouter();

  useEffect(() => {
    if (state?.success === false) { //unauthorized
      tokenContext?.setAccessToken('');
      router.push('/');
    }
  }, [state?.success, router, tokenContext]);

  useEffect(() => {
    if (state?.success && state?.accessToken) {
      tokenContext?.setAccessToken(state.accessToken);
      setAddDrawer(false);
    }
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  useEffect(() => {
    if(addDrawer && drawerAddRef.current)
      drawerAddRef.current.focus();
  })

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="rounded-3xl appWidth mt-5 bg-slate-800 h-[100px] flex flex-col gap-2 justify-center items-center relative"
    >
      {addDrawer ? (
        <>
          <motion.span
            variants={itemVariants}
            className="absolute text-white top-0 right-0 mr-4 mt-2 scale-105 hover:scale-115 cursor-pointer"
            onClick={() => setAddDrawer(false)}
          >
            <b>x</b>
          </motion.span>

          <motion.form
            variants={containerVariants}
            action={action}
            className="p-5 flex flex-col justify-center items-center gap-3"
          >
            <input
              name="accessToken"
              value={tokenContext?.accessToken}
              hidden
              readOnly
            />
            <input
              ref={drawerAddRef}
              placeholder="Name you drawer"
              name="title"
              className="text-white p-1 outline-none selection:outline-0 text-center"
              onChange={(e) => setDrawerName(e.target.value)}
            />
            <button
              type="submit"
              className={
                "w-full bg-blue-400 text-white rounded-3xl block m-1 h-[30px] xl:h-[38px] cursor-pointer center xl:hover:scale-105 xl:active:scale-95 " +
                (drawerName === "" && " opacity-50")
              }
              disabled={drawerName === ''}
            >
              {isPending ? <Loader /> : "Create drawer"}
            </button>
          </motion.form>
        </>
      ) : (
        <>
          <motion.span variants={itemVariants} className="text-white">
            Add drawer
          </motion.span>
          <motion.span
            variants={itemVariants}
            className="hover:text-blue-400 cursor-pointer text-white"
          >
            <Plus width={30} height={30} onClick={() => setAddDrawer(true)} />
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
