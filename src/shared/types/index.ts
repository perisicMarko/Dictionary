export type TUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  account_action_token: string | null;
  account_action_token_expires_at: Date | null;
  email_verified: boolean | null;
  school_id: number | null;
  languages: string | null;
};

export type TStudent = {
  firstName: string;
  lastName: string;
  email: string;
  languages: string | null;
  keyExpirationDate: Date;
}


export type TDefinition = {
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
};

export type TMeaning = {
  partOfSpeech: string;
  definitions: TDefinition[];
};

export type TWordApp = {
  word: string;
  audio: Uint8Array<ArrayBuffer> | null; // todo_note: it can be null in the database, in future cron job will fill audios that are missing
  generated_notes: TMeaning[];
  word_id: number;
};

export type TDBNoteEntry = {
  id: number;
  word: string
  is_learned: boolean;
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
  is_learned: boolean;
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
    audio: Uint8Array<ArrayBuffer>;
  };
};

export type TColorsTheme = {
    main: string;
    second: string;
    text_main: string;
    text_second: string;
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

export type TSubscription = {
  email: string;
  key_expiration_date: Date;
  school_id: number;
  languages: string;
}
