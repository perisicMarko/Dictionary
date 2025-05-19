import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useContext, useState } from "react";
import { TokenContext } from "../../../../components/TokenContextProvider";
import { updateReviewDate } from "@/actions/manageNotes";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Loader from "../../../../components/common/Loader";

export function GradeForm({
  toggleMenu,
  changeQuality,
  noteId,
  quality,
  rerenderParent,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  noteId: number;
  quality: number;
  rerenderParent: () => void;
}) {
  const tokenContext = useContext(TokenContext);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function onSubmitGradeHandle(formData: FormData) {
    if (tokenContext?.accessToken === undefined) return;
    changeQuality(-1);
    const response = await updateReviewDate(
      Number(formData.get("quality")),
      noteId,
      tokenContext.accessToken || ""
    );
    if (!response?.success) {
      router.push("/sessionExpired");
    }
    rerenderParent();
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="center w-full"
    >
      <motion.form
        variants={itemVariants}
        className="rounded-2xl w-full py-2"
        action={(e) => onSubmitGradeHandle(e)}
      >
        <input type="text" name="noteId" defaultValue={Number(noteId)} hidden />
        <label htmlFor="recall" className="text-white text-[16px] sm:text-xl">
          Remember this word?
        </label>
        <div className="center relative w-full">
          <ChevronDown
            color="white"
            width={25}
            height={25}
            className="absolute right-5 z-5 pointer-events-none"
          />
          <select
            id="recall"
            defaultValue={-1}
            name="quality"
            onClick={() => toggleMenu()}
            onChange={(e) => changeQuality(Number(e.target.value))}
            className="primary-btn appearance-none py-2 focus:outline-none px-3 text-xs sm:text-xl"
          >            
            <option value="-1" disabled>
              Grade from 0-5{" "}
            </option>
            <option value="0">0 – completely forgotten</option>
            <option value="1">
              1 – wrong, remembered after checking notes
            </option>
            <option value="2">
              2 – wrong, but felt easy to recall
            </option>
            <option value="3">
              3 – correct, but with great effort
            </option>
            <option value="4"> 
              4 – correct, some hesitation
            </option>
            <option value="5">
              5 – perfect, immediate recall  
            </option>
          </select>
        </div>
        {quality != -1 && (
          <motion.button
            type="submit"
            variants={itemVariants}
            className="primary-btn center"
            onClick={() => setIsPending(true)}
          >
            {isPending ? <Loader /> : <b>Grade</b>}
          </motion.button>
        )}

      </motion.form>
    </motion.div>
  );
}
