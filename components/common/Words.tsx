import Note from "@/components/Note";
import { TNoteApp } from "@/lib/types";

export default function Words({
  props,
  historyNote,
  drawerId,
  rerenderParent,
}: {
  props: TNoteApp[] | undefined;
  historyNote: boolean;
  drawerId: number;
  rerenderParent: () => void;
}) {
  return (
    <>
      {props?.map((w: TNoteApp) => {
        return (
          <Note
            key={w.id}
            prop={w}
            historyNote={historyNote}
            drawerId={drawerId}
            rerenderParent={rerenderParent}
          ></Note>
        );
      })}
    </>
  );
}
