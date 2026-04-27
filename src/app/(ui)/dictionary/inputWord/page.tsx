"use client";
import { useState } from "react";
import { Help } from "./Help";
import SaveNoteForm from "./SaveNoteForm";

export default function UserInput() {
  const [help, setHelp] = useState(false);

  function toggleHelp() {
    setHelp(!help);
  }

  return (
    <>
      {!help ? (
        <SaveNoteForm
          toggleHelp={toggleHelp}
        />
      ) : (
        <Help toggleHelp={toggleHelp} help={help} />
      )}
    </>
  );
}
