import * as diem from './diem';
import * as mg from './mg';
import { type BibleBook, type VerseReference, type BibleVersion } from './types';

const BIBLE_VERSIONS: BibleVersion[] = ['mg', 'diem'];

function getBibleData(version: BibleVersion) {
  const data = version === 'diem' ? diem : mg;
  return data as Record<string, BibleBook>;
}

function parseVerseReference(reference: string): VerseReference {
  const parts = reference.toLowerCase().split(' ');
  const bookPart = parts[0];
  let versePart = parts[1];

  if (!bookPart) {
    throw new Error('Book not found in reference');
  }

  let bookKey = bookPart;
  if (/^\d/.exec(bookPart)) {
    const bookName = parts[1];
    bookKey = `${bookName}${bookPart}`;
    versePart = parts[2];
  }

  if (!versePart) {
    return {
      book: bookKey,
      chapter: 1,
    };
  }

  const [chapter, verseRange] = versePart.split(':');

  if (!chapter) {
    throw new Error('Chapter not found in reference');
  }

  if (!verseRange) {
    return {
      book: bookKey,
      chapter: parseInt(chapter),
    };
  }

  let verses: number[] = [];
  if (verseRange.includes('-')) {
    const [start, end] = verseRange.split('-').map(Number);

    if (!end || !start || end < start) {
      throw new Error('Invalid verse range');
    }

    verses = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  } else if (verseRange.includes(',')) {
    verses = verseRange.split(',').map(Number);
  } else {
    verses = [parseInt(verseRange)];
  }

  return {
    book: bookKey,
    chapter: parseInt(chapter),
    verses,
  };
}

export function getVerses(
  version: BibleVersion,
  reference: string
): {
  reference: string;
  verses: Record<string, string>;
} {
  if (!BIBLE_VERSIONS.includes(version)) {
    throw new Error(`Invalid Bible version: ${version}. Available versions: ${BIBLE_VERSIONS.join(', ')}`);
  }

  const parsed = parseVerseReference(reference);
  const bookData = getBibleData(version)[parsed.book];

  if (!bookData) {
    throw new Error(`Book not found: ${parsed.book}`);
  }

  const chapter = bookData[parsed.chapter.toString()];
  if (!chapter) {
    throw new Error(`Chapter not found: ${parsed.chapter}`);
  }

  if (!parsed.verses) {
    return getChapter(version, reference);
  }

  const verses = parsed.verses.reduce(
    (acc, v) => {
      const verse = (chapter as Record<string, string>)[v.toString()];
      if (!verse) {
        throw new Error(`Verse not found: ${v}`);
      }
      acc[v.toString()] = `${v}. ${verse}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    reference,
    verses,
  };
}

function getChapter(
  version: BibleVersion,
  reference: string
): {
  reference: string;
  verses: Record<string, string>;
} {
  const parsed = parseVerseReference(reference);
  const bookData = getBibleData(version)[parsed.book];

  if (!bookData) {
    throw new Error(`Book not found: ${parsed.book}`);
  }

  const chapter = bookData[parsed.chapter.toString()];
  if (!chapter) {
    throw new Error(`Chapter not found: ${parsed.chapter}`);
  }

  const versesWithNumbers = Object.entries(chapter as Record<string, string>).reduce(
    (acc, [num, text]) => {
      acc[num] = `${num}. ${text}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    reference,
    verses: versesWithNumbers,
  };
}

export function listBooks(version: BibleVersion): string[] {
  if (!BIBLE_VERSIONS.includes(version)) {
    throw new Error(`Invalid Bible version: ${version}. Available versions: ${BIBLE_VERSIONS.join(', ')}`);
  }

  const bibleData = getBibleData(version);
  return Object.keys(bibleData).sort((a, b) => {
    // Handle numbered books (e.g., 1-samoela, 2-samoela)
    const aMatch = a.match(/^(\d+)-(.+)$/);
    const bMatch = b.match(/^(\d+)-(.+)$/);
    
    if (aMatch && bMatch) {
      // If both are numbered books, sort by number first
      const aNum = parseInt(aMatch[1]);
      const bNum = parseInt(bMatch[1]);
      if (aNum !== bNum) return aNum - bNum;
      // If numbers are the same, sort by name
      return aMatch[2].localeCompare(bMatch[2]);
    } else if (aMatch) {
      // If only a is numbered, it should come first
      return -1;
    } else if (bMatch) {
      // If only b is numbered, it should come first
      return 1;
    }
    // If neither is numbered, sort alphabetically
    return a.localeCompare(b);
  });
}

export function countVerses(version: BibleVersion, bookName: string): number {
  if (!BIBLE_VERSIONS.includes(version)) {
    throw new Error(`Invalid Bible version: ${version}. Available versions: ${BIBLE_VERSIONS.join(', ')}`);
  }

  const bibleData = getBibleData(version);
  const book = bibleData[bookName.toLowerCase()];

  if (!book) {
    throw new Error(`Book not found: ${bookName}`);
  }

  let totalVerses = 0;
  Object.keys(book).forEach(chapter => {
    if (chapter !== 'name' && chapter !== 'order' && chapter !== 'chapter_number') {
      const chapterData = book[chapter] as Record<string, string>;
      totalVerses += Object.keys(chapterData).length;
    }
  });

  return totalVerses;
}

export type { BibleVersion, VerseReference }; 