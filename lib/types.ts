export type TUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  refresh_token: string | null;
  refresh_token_expiration_date: Date | null;
  email_verified: boolean | null;
  school_id: number | null;
  languages: string | null;
};

export type TStudent = {
  firstName: string;
  lastName: string;
  email: string;
  languages: string | null;
}

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
  example: string;
  synonyms: string[];
};

export type TMeaning = {
  partOfSpeech: string;
  definitions: TDefinition[];
};


export type TWordApp = {
  word: string;
  audio: string;
  generated_notes: TMeaning[];
  word_id: number;
};


export type TDBNoteEntry = {
  id: number;
  word: string
  status: boolean;
  user_notes: string;
  repetitions: number;
  days: number;
  review_date: Date;
  ease_factor: number;
  user_id: number;
  language: string;
};

export type TNoteApp = {
  id: number;
  status: boolean;
  user_notes: string;
  repetitions: number;
  days: number;
  review_date: Date;
  ease_factor: number;
  user_id: number;
  language: string;
  word_id: number;
  dictionary_words: {
    word: string;
    meanings: TMeaning[];
    audio: string;
  };
};

export type TColorsTheme = {
    main: string;
    second: string;
};


export type TDrawer = {
  id: number;
  name: string;
  user_id: number;
}

export type TWordsByDrawer = {
  drawer_id: number;
  word_id: number;
  name: string;
}