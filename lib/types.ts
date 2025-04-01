export type TUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  refresh_token: string | null;
  refresh_token_expiration_date: Date | null;
  email_verified: boolean | null;
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

type TDefinition = {
  definition: string;
  example: string | undefined;
};

type TMeaning = {
  partOfSpeech: string;
  definitions: TDefinition[];
};


export type TWordApp = {
  word: string;
  audio: string;
  meanings: TMeaning[];
  parsedNote: string;
};


export type TDBNoteEntry = {
  id: number;
  word: string
  status: boolean;
  user_notes: string;
  generated_notes: string;
  audio: string;
  repetitions: number;
  days: number;
  review_date: Date;
  ease_factor: number;
  user_id: number;
  language: string;
};