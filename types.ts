export type Meta = {
  name: string;
  order: number;
  chapter_number: number;
};

// ...existing code...

export type Verse = {
  verse: number;
  text: string;
};

export type Chapter = Record<string, string>;

export type BibleBook = Record<string, Chapter | Meta>;

export type VerseReference = {
  book: string;
  chapter: number;
  verses?: number[]; // Make verses optional
};

export type BibleVersion = "diem" | "mg";
