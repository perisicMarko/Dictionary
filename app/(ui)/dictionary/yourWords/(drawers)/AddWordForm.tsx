import { TokenContext } from "@/components/TokenContextProvider";
import { containerVariants } from "@/lib/animationVariants";
import { useActionState, useContext, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { putWordInDrawer } from "@/actions/manageNotes/manageDrawers";
import { useRouter } from "next/navigation";

export default function StrictAutocomplete({
  words,
  drawerId,
  rerender
}: {
  words: { word: string; wordId: number }[] | undefined;
  drawerId : number;
  rerender: () => void;
}) {
  const options = words?.map((o: { word: string; wordId: number }) => o.word);
  const addWordInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState(options);
  const [validWord, setIsValidWord] = useState(false);
  const [importState, importAction, isImporting] = useActionState(putWordInDrawer, undefined);
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
    rerender();
    setValue('');
  }

  return (
    <motion.form
      action={(e) => handleImport(e)}
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col justify-center items-center gap-2 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        name="accessToken"
        value={tokenContext?.accessToken}
        readOnly
        hidden
      />
      <input name="drawerId" value={drawerId} readOnly hidden />
      <input name="addedWordId" value={words?.find((w: { word: string; wordId: number }) => w.word === value)?.wordId || -1} readOnly hidden />
      <input
        ref={addWordInput}
        list="words"
        value={value}
        name="word"
        onChange={handleChange}
        className="text-white p-2 outline-none active:outline-none rounded-3xl border-2 border-white w-full"
        placeholder="Input your word..."
      />
      <datalist id="words">
        {filtered?.map((opt) => (
          <option
            key={opt}
            value={opt}
          />
        ))}
      </datalist>
      <motion.button
       type="submit"
       className={"w-full center cursor-pointer xl:hover:scale-105 xl:active:scale-95 bg-blue-400 p-2 rounded-3xl text-white " + ((value === '' || !validWord) ? " opacity-50" : "")}
       disabled={!validWord || value === ''}
      >
        <span className="h-[20px] center">
          {isImporting ? <Loader/> : "Put in drawer"}
        </span>
      </motion.button>
    </motion.form>
  );
}
