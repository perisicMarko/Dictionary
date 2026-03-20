import { TokenContext } from "@/components/TokenContextProvider";
import { containerVariants } from "@/lib/animationVariants";
import { useActionState, useContext, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import { putNoteInDrawer } from "@/actions/manageNotes/manageDrawers";
import { useRouter } from "next/navigation";

export default function StrictAutocomplete({
  notes,
  drawerId,
  rerender
}: {
  notes: { word: string; noteId: number }[] | undefined;
  drawerId : number;
  rerender: () => void;
}) {
  const options = notes?.map((o: { word: string; noteId: number }) => o.word);
  const addWordInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState(options);
  const [validWord, setIsValidWord] = useState(false);
  const [importState, importAction, isImporting] = useActionState(putNoteInDrawer, undefined);
  const tokenContext = useContext(TokenContext);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    setFiltered(
      options?.filter((opt) => opt.toLowerCase().includes(input.toLowerCase()))
    );
    const index = options?.findIndex((opt) => opt.toLowerCase().trim() === input.toLowerCase().trim());
    setIsValidWord(index != -1);
  };

  useEffect(() => {
    if(addWordInput.current)
      addWordInput.current.focus();
  }, []);

  
  useEffect(() => {
    if(importState?.success){
      tokenContext?.setAccessToken(importState.accessToken);
    }else if(importState?.success === false)
      router.push('/');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importState?.success]);
  
  const handleImport = async (e: FormData) => {
    importAction(e);
    setValue('');
    rerender();
  }

  return (
    <motion.form
      action={(e) => handleImport(e)}
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="center-vertically gap-2 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        name="accessToken"
        value={tokenContext?.accessToken}
        readOnly
        hidden
      />
      <input name="drawerId" value={drawerId} readOnly hidden />
      <input name="addedNoteId" value={notes?.find((w: { word: string; noteId: number }) => w.word === value)?.noteId || -1} readOnly hidden />
      <input
        ref={addWordInput}
        list="notes"
        value={value.toLowerCase()}
        name="word"
        onChange={handleChange}
        className="text-text-main p-2 outline-none active:outline-none rounded-3xl w-full"
        placeholder="Input your word..."
      />
      <datalist id="notes">
        {filtered?.map((opt, index) => (
          <option
            key={opt + index}
            value={opt}
          />
        ))}
      </datalist>
      <motion.button
       type="submit"
       className={`w-full center cursor-pointer transition-all xl:hover:scale-105 xl:active:scale-95 bg-second p-2 rounded-3xl text-text-main ${(value === '' || !validWord) ? " opacity-50" : ""}`}
       disabled={!validWord || value === ''}
      >
        <span className="h-[20px] center">
          {isImporting ? <Loader/> : "Put in drawer"}
        </span>
      </motion.button>
    </motion.form>
  );
}
