import Note from "@/components/Note";
import { TNoteApp } from "@/lib/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="w-full flex flex-col justify-center items-center">
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
    </div>
  );
}
