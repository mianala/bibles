export type Meta = {
  name: string;
  order: number;
  chapter_number: number;
};

export type Verse = {
  verse: number;
  text: string;
};

export type Chapter = Record<string, string>;

export type BibleBook = {
  name?: string;
  order?: number;
  chapter_number?: number;
  [key: string]: Chapter | Meta | string | number | undefined;
};

export type VerseReference = {
  book: string;
  chapter: number;
  verses?: number[];
};

export type BibleVersion = "diem" | "mg" | "kjv" | "apee";

export type KJVAPEEBook = {
  abbrev: string;
  name: string;
  chapters: string[][];
};

export type KJVAPEEFormat = KJVAPEEBook[]; 