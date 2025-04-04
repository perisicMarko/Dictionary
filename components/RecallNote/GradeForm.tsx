import { motion } from "framer-motion";
import Image from "next/image";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export function GradeForm({
  toggleMenu,
  changeQuality,
  noteId,
  quality,
  accessToken,
  rerenderHandle,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  noteId: number;
  quality: number;
  accessToken: string | undefined;
  rerenderHandle: () => void;
}) {

  async function onSubmitGradeHandle(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (accessToken === undefined) return;
    changeQuality(-1);
    const response = await fetch("/api/dictionary/recall/grade", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        noteId: Number(formData.get("noteId")),
        accessToken: accessToken,
        quality: formData.get("recall"),
      }),
    });
    console.log(response);
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
        className="rounded-2xl w-full py-2 relative"
        onSubmit={onSubmitGradeHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <label htmlFor="recall" className="text-white text-xs sm:text-xl">
          Remember this word?
        </label>
        <Image
          src="/arrowDown.svg"
          alt="arrow icon"
          width={20}
          height={20}
          className="ml-3 w-auto h-auto top-10 sm:top-12 pointer-events-none md:top-13 xl:top-14 right-5 sm:right-11 scale-80 sm:scale-100 z-5 inline-block absolute"
        ></Image>
        <select
          id="recall"
          defaultValue={-1}
          name="recall"
          onClick={() => toggleMenu()}
          onChange={(e) => changeQuality(Number(e.target.value))}
          className="relative mt-1 block text-white hover:scale-105 active:scale-95 bg-blue-400 w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] appearance-none cursor-pointer py-2 rounded-3xl focus:outline-none px-3 text-xs sm:text-xl"
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

        {quality != -1 && (
          <motion.button variants={itemVariants} className="primaryBtn">
            <b>Grade</b>
          </motion.button>
        )}
      </motion.form>
    </motion.div>
  );
}
