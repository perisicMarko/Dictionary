"use client";

import { useState } from "react";
import { Help } from "./Help";
import SaveNoteForm from "./SaveNoteForm";

export default function InputWordView({ initialWords }: { initialWords: string[] }) {
  const [help, setHelp] = useState(false);

  function toggleHelp() {
    setHelp((current) => !current);
  }

  return (
    <>
      {!help ? (
        <SaveNoteForm toggleHelp={toggleHelp} initialWords={initialWords} />
      ) : (
        <Help toggleHelp={toggleHelp} help={help} />
      )}
    </>
  );
}
