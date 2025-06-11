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
        <h2 className="text-blue-400 self-start text-center mb-3">
          <b>{word}</b>
        </h2>
      )}
      {meanings.map((meaning, i) => {
        return (
          <div key={i} className="mt-2">
            <h2 className="text-white text-center">
              Meaning {i + 1} <br />
              Part of speech: {meaning.partOfSpeech}
            </h2>
            {meaning.definitions.map((d, j) => {
              return (
                <div key={j} className="mt-2">
                  <div className="text-blue-400 w-full resize-none overflow-hidden mb-0">
                    -Definition {j + 1 + ": " + d.definition}
                  </div>

                  {d.example != "" && (
                    <div className="text-blue-300 w-full resize-none overflow-hidden mb-0">
                      Example: {d.example}
                    </div>
                  )}

                  {d.synonyms.length != 0 && (
                    <div className="text-blue-100 w-full inline-block resize-none overflow-hidden mb-0">
                      Synonyms: {d.synonyms.join(", ")}
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
