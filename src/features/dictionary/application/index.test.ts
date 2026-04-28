import { describe, expect, it } from "vitest";
import { reformatApiNotes } from "./index";
import { TGeneratedNote } from "@/shared/types";

describe("reformatApiNotes", () => {
  it("maps word, meanings and first available audio", () => {
    const input: TGeneratedNote = {
      word: "learn",
      phonetics: [
        { text: "/l3:n/" },
        { audio: "https://cdn.example.com/learn.mp3" },
      ],
      meanings: [
        {
          partOfSpeech: "verb",
          definitions: [
            {
              definition: "To gain knowledge.",
              example: "I learn every day.",
              synonyms: ["study"],
            },
          ],
        },
      ],
      license: { name: "CC", url: "https://license.example.com" },
      sourceUrls: ["https://source.example.com"],
    };

    const result = reformatApiNotes(input);

    expect(result.word).toBe("learn");
    expect(result.audio).toBe("https://cdn.example.com/learn.mp3");
    expect(result.generated_notes).toHaveLength(1);
    expect(result.generated_notes[0].partOfSpeech).toBe("verb");
    expect(result.generated_notes[0].definitions[0].definition).toBe(
      "To gain knowledge.",
    );
    expect(result.generated_notes[0].definitions[0].example).toBe(
      "I learn every day.",
    );
    expect(result.generated_notes[0].definitions[0].synonyms).toEqual(["study"]);
    expect(result.word_id).toBe(-1);
  });

  it("falls back to empty strings/arrays when optional fields are missing", () => {
    const input: TGeneratedNote = {
      word: "focus",
      phonetics: [{ text: "/fokus/" }],
      meanings: [
        {
          partOfSpeech: "noun",
          definitions: [{ definition: "Center of activity." }],
        },
      ],
      license: { name: "CC", url: "https://license.example.com" },
      sourceUrls: ["https://source.example.com"],
    };

    const result = reformatApiNotes(input);

    expect(result.audio).toBe("");
    expect(result.generated_notes[0].definitions[0].example).toBe("");
    expect(result.generated_notes[0].definitions[0].synonyms).toEqual([]);
  });
});
