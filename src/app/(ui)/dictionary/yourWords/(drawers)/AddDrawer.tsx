import { motion } from "framer-motion";
import { useState, useActionState, useEffect, useRef } from "react";
import { containerVariants, itemVariants } from "@/shared/lib/animationVariants";
import { Plus } from "lucide-react";
import { createDrawer } from "@/features/drawers/application";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

export default function AddDrawer({
  rerender,
  drawerNames,
}: {
  rerender: () => void;
  drawerNames: string[] | undefined;
}) {
  const [addDrawer, setAddDrawer] = useState(false);
  const [state, action, isPending] = useActionState(createDrawer, undefined);
  const [drawerName, setDrawerName] = useState("");
  const drawerAddRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    if(!state?.success){
        router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  useEffect(() => {
    if (state?.success) {
      setAddDrawer(false);
    }
    rerender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  useEffect(() => {
    if (addDrawer && drawerAddRef.current) drawerAddRef.current.focus();
  });

  function isValidDrawerName(){
    if(drawerName === "")
      return false;
    else if(drawerNames?.includes(drawerName))
      return false;
    else 
      return true;
  }

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
            className="absolute text-text-main top-0 right-3 mr-4 mt-2 scale-105 hover:scale-115 cursor-pointer transition-all"
            onClick={() => setAddDrawer(false)}
          >
            <b>x</b>
          </motion.span>

          <motion.form
            variants={containerVariants}
            action={(e) => {
              action(e);
              rerender();
              setDrawerName("");
            }}
            className="p-5 center-vertically gap-3"
          >
            <input
              ref={drawerAddRef}
              placeholder="Name you drawer"
              name="title"
              className="text-text-main p-1 outline-none selection:outline-0 text-center"
              value={drawerName}
              onChange={(e) => setDrawerName(e.target.value)}
            />
            <button
              type="submit"
              className={`primary-btn !h-[30px] !xl:h-[38px] center " +
                ${!isValidDrawerName() ? " opacity-50" : ""}`}
              disabled={!isValidDrawerName()}
            >
              {isPending ? <Loader /> : "Create drawer"}
            </button>
          </motion.form>
        </>
      ) : (
        <>
          <motion.span variants={itemVariants} className="text-text-main">
            Add drawer
          </motion.span>
          <motion.span
            variants={itemVariants}
            className="hover:text-text-second cursor-pointer text-text-main transition-all duration-200"
            title="Add drawer"
          >
            <Plus width={30} height={30} onClick={() => setAddDrawer(true)} />
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
