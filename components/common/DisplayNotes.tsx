import { TMeaning } from "@/lib/types";

export default function DisplayNotes({
  word,
  meanings,
  includeWord,
}: {
  word: string;
  meanings: TMeaning[];
  includeWord: boolean; //used to determin should word be displayed with generated notes, in Note component it should not but for SaveNoteForm should
}) {
  
  return (
    <div className="h-50 md:h-75 xl:h-100 w-full scrollbar-track-transparent mt-1">
      {includeWord && (
        <h2 className="text-text-main self-start text-center mb-3">
          <b>{word}</b>
        </h2>
      )}
      {meanings.map((meaning, i) => {
        return (
          <div key={i} className="mt-2 w-full">
            <h2 className="text-text-main text-center">
              Meaning {i + 1} <br />
              Part of speech: {meaning.partOfSpeech}
            </h2>
            {meaning.definitions.map((d, j) => {
              return (
                <div
                  key={j}
                  className="mt-2 border-second w-full border-1 p-2 sm:p-3 rounded-2xl"
                >
                  <div className="text-text-second w-full resize-none overflow-hidden mb-0">
                    <i><b>Definition:</b></i>{" "}
                    <p className="pl-2">{d.definition}</p>
                  </div>

                  {d.examples.length > 0 && (
                    <div className="text-text-second w-full resize-none mb-0">
                      <i><b>Examples:</b></i>
                      <ul className="ml-2 list-none">
                        {
                          d.examples.map((e, k) => (
                            <li
                              key={k}
                              className="p-0 before:content-['•'] before:mr-1 before:inline-block"
                            >
                              <i>{e}</i>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  )}

                  {d.synonyms.length > 0 && (
                    <div className="text-text-second w-full inline-block resize-none overflow-hidden mb-0">
                      <i><b>Synonyms:</b></i>{" "}
                      {d.synonyms.join(", ")}
                    </div>
                  )}

                  {d.antonyms.length != 0 && (
                    <div className="text-text-second w-full inline-block resize-none overflow-hidden mb-0">
                      <i><b>Antonyms:</b></i>{" "}
                      {d.antonyms.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
            {i != meanings.length - 1 && <hr className="text-text-main my-3" />}
          </div>
        );
      })}
    </div>
  );
}
