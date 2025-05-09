import Note from "@/components/Note";
import { TDBNoteEntry } from "@/lib/types";

export default function Words({
  props,
  historyNote,
  drawerId,
  handle,
}: {
  props: TDBNoteEntry[] | undefined;
  historyNote: boolean;
  drawerId: number;
  handle: () => void;
}) {
  return (
    <>
      {props?.map((w: TDBNoteEntry) => {
        return (
          <Note
            key={w.id}
            prop={w}
            historyNote={historyNote}
            drawerId={drawerId}
            handle={handle}
          ></Note>
        );
      })}
    </>
  );
}
