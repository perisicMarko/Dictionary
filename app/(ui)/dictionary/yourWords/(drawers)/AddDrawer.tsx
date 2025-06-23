import { motion } from "framer-motion";
import { useState, useContext, useActionState, useEffect, useRef } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { Plus } from "lucide-react";
import { createDrawer } from "@/actions/manageNotes/manageDrawers";
import { TokenContext } from "@/components/TokenContextProvider";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

export default function AddDrawer({rerender} : {rerender : () => void}) {
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
    rerender();
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
      className="box-layout mt-5 h-[100px] center-vertically gap-2 relative"
    >
      {addDrawer ? (
        <>
          <motion.span
            variants={itemVariants}
            className="absolute text-white top-0 right-3 mr-4 mt-2 scale-105 hover:scale-115 cursor-pointer transition-all"
            onClick={() => setAddDrawer(false)}
          >
            <b>x</b>
          </motion.span>

          <motion.form
            variants={containerVariants}
            action={action}
            className="p-5 center-vertically gap-3"
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
                `primary-btn !h-[30px] !xl:h-[38px] center " +
                ${drawerName === "" ? " opacity-50" : ""}`
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
            className="hover:text-second cursor-pointer text-white"
            title='Add drawer'
          >
            <Plus width={30} height={30} onClick={() => setAddDrawer(true)}/>
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
