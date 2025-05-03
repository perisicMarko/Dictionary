import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useContext } from "react";
import { TokenContext } from "../TokenContextProvider";
import { updateReviewDate } from "@/actions/manageNotes";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function GradeForm({
  toggleMenu,
  changeQuality,
  noteId,
  quality,
  rerenderHandle,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  noteId: number;
  quality: number;
  rerenderHandle: () => void;
}) {
  const tokenContext = useContext(TokenContext);
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
    rerenderHandle(); //refresh parrent
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="center"
    >
      <motion.form
        variants={itemVariants}
        className="rounded-2xl w-full py-2"
        action={(e) => onSubmitGradeHandle(e)}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <label htmlFor="recall" className="text-white text-[16px] sm:text-xl">
          Remember this word?
        </label>
        <div className="center relative">
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
            className="block text-white xl:hover:scale-105 bg-blue-400 w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] appearance-none cursor-pointer py-2 rounded-3xl focus:outline-none px-3 text-xs sm:text-xl mt-2"
          >
            <option value="-1" disabled>
              Grade from 0-5{" "}
            </option>
            <option value="0">0(complete blackout)</option>
            <option value="1">
              1(incorrect response, the correct one remembered after reading
              notes)
            </option>
            <option value="2">
              2(incorrect response, where the correct one seemed easy to recall)
            </option>
            <option value="3">
              3(correct response, recalled with serious difficulty)
            </option>
            <option value="4">4(correct response, after hestitation)</option>
            <option value="5">5(perfect response)</option>
          </select>
        </div>

        {quality != -1 && (
          <motion.button variants={itemVariants} className="primaryBtn">
            <b>Grade</b>
          </motion.button>
        )}
      </motion.form>
    </motion.div>
  );
}
