
export type TUser = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export type TGPhonetic = {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
};

export type TGMeaning = {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
  }[];
};

export type TGeneratedNote = {
  word: string;
  phonetics: TGPhonetic[];
  meanings: TMeaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
};

export type TDefinition = {
    definition: string;
    example: string | undefined;
  };
  
export type TMeaning = {
    partOfSpeech: string;
    definitions: TDefinition[];
};

  
export type TWordApp = {
    word: string;
    sound: string;
    meanings: TMeaning[];
    parsedNote: string;
};


export type TDBNote = {
    word: string;
    sound: string;
    generated: string | null;
    user_notes: string;
    generated_notes: string;
};
  
export type TDBNoteEntry = {
    id: number;
    notes: TDBNote;
    user_id: number;
    learned: boolean;
};