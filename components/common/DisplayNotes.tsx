import { TMeaning } from "@/lib/types";

export default function DisplayNotes({
  word,
  meanings,
  includeWord,
}: {
  word: string;
  meanings: TMeaning[];
  includeWord: boolean; //used to determin should word be displayed with generated notes, in Note component should not but for SaveNoteForm should
}) {
  
  return (
    <div className="h-50 md:h-75 xl:h-100 w-full scrollbar-track-transparent mt-1">
      {includeWord && (
        <h2 className="text-second self-start text-center mb-3">
          <b>{word}</b>
        </h2>
      )}
      {meanings.map((meaning, i) => {
        return (
          <div key={i} className="mt-2 w-full">
            <h2 className="text-white text-center">
              Meaning {i + 1} <br />
              Part of speech: {meaning.partOfSpeech}
            </h2>
            {meaning.definitions.map((d, j) => {
              return (
                <div
                  key={j}
                  className="mt-2 border-second w-full border-1 p-2 sm:p-3 rounded-2xl"
                >
                  <div className="text-second w-full resize-none overflow-hidden mb-0">
                    <i className="text-white">-Definition</i>{" "}
                    {j + 1 + ": " + d.definition}
                  </div>

                  {d.example != "" && (
                    <div className="text-second w-full resize-none overflow-hidden mb-0">
                      <i className="text-white">-Example:</i> {d.example}
                    </div>
                  )}

                  {d.synonyms.length != 0 && (
                    <div className="text-second w-full inline-block resize-none overflow-hidden mb-0">
                      <i className="text-white">-Synonyms:</i>{" "}
                      {d.synonyms.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
            {i != meanings.length - 1 && <hr className="text-white my-3" />}
          </div>
        );
      })}
    </div>
  );
}