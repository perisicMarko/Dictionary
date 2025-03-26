
export type TUser = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    refresh_token: string;
    token_expiration_date: Date;
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
    audio: string;
    meanings: TMeaning[];
    parsedNote: string;
};



// ovo hocu da izbacim da ne koristim vise
export type TDBNote = {
    word: string;
    audio: string;
    generated: string | null;
    user_notes: string;
    generated_notes: string;
};
  
export type TDBNoteEntry = {
    id: number;
    user_id: number;
    word: string
    status: boolean;
    language: string;
    user_notes: string;
    generated_notes: string;
    audio: string;
    repetitions: number;
    days: number;
    ease_factor: number;
    review_date: string;
};