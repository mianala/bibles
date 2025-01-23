import * as diem from './diem';
import * as mg from './mg';
import { type BibleBook, type VerseReference, type BibleVersion } from './types';

export const BIBLE_VERSIONS: BibleVersion[] = ['mg', 'diem'];

function getBibleData(version: BibleVersion) {
  const data = version === 'diem' ? diem : mg;
  // Return as-is since we handle meta in the type system now
  return data as Record<string, BibleBook>;
}

export function parseVerseReference(reference: string) {
  const parts = reference.toLowerCase().split(' ');
  const bookPart = parts[0];
  let versePart = parts[1];

  if (!bookPart) {
    throw new Error('Book not found in reference');
  }

  // Handle book names with numbers (e.g., "1 jaona")
  let bookKey = bookPart;
  if (/^\d/.exec(bookPart)) {
    const bookName = parts[1];
    bookKey = `${bookName}${bookPart}`; // Transform "1 jaona" to "jaona1"
    versePart = parts[2]; // Update versePart to the correct position for numbered books
  }

  if (!versePart) {
    // Chapter-only reference
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
    // Chapter-only reference
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

export function getChapter(
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

  // Add verse numbers to each verse
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

export function getVerses(
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

  // If no verses specified, return whole chapter
  if (!parsed.verses) {
    return getChapter(version, reference);
  }

  // Return object with only requested verses, including verse numbers
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
