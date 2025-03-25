import * as diem from './diem';
import * as mg from './mg';
import kjvData from './en_kjv.json';
import apeeData from './fr_apee.json';
import { type BibleBook, type VerseReference, type BibleVersion, type KJVAPEEFormat } from './types';

const BIBLE_VERSIONS: BibleVersion[] = ['mg', 'diem', 'kjv', 'apee'];

function getBibleData(version: BibleVersion) {
  switch (version) {
    case 'diem':
      return diem as unknown as Record<string, BibleBook>;
    case 'mg':
      return mg as unknown as Record<string, BibleBook>;
    case 'kjv':
      return convertKJVAPEEFormat(kjvData as KJVAPEEFormat);
    case 'apee':
      return convertKJVAPEEFormat(apeeData as KJVAPEEFormat);
    default:
      throw new Error(`Unsupported Bible version: ${version}`);
  }
}

function convertKJVAPEEFormat(data: KJVAPEEFormat): Record<string, BibleBook> {
  return data.reduce((acc, book) => {
    const bookData: BibleBook = {
      name: book.name,
      order: 0,
      chapter_number: book.chapters.length,
    };

    book.chapters.forEach((chapter, chapterIndex) => {
      const chapterData: Record<string, string> = {};
      chapter.forEach((verse, verseIndex) => {
        chapterData[(verseIndex + 1).toString()] = verse;
      });
      bookData[(chapterIndex + 1).toString()] = chapterData;
    });

    acc[book.abbrev.toLowerCase()] = bookData;
    acc[book.name.toLowerCase()] = bookData;
    return acc;
  }, {} as Record<string, BibleBook>);
}

function parseVerseReference(reference: string): VerseReference {
  const parts = reference.toLowerCase().split(' ');
  
  if (/^\d/.test(parts[0]) && parts.length >= 2) {
    const number = parts[0];
    const bookName = parts[1];
    const versePart = parts[2];
    const combinedBookName = `${number} ${bookName}`;

    if (!versePart) {
      return {
        book: combinedBookName,
        chapter: 1,
      };
    }

    const [chapter, verseRange] = versePart.split(':');

    if (!chapter) {
      throw new Error('Chapter not found in reference');
    }

    if (!verseRange) {
      return {
        book: combinedBookName,
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
      book: combinedBookName,
      chapter: parseInt(chapter),
      verses,
    };
  }

  const bookPart = parts[0];
  const versePart = parts[1];

  if (!bookPart) {
    throw new Error('Book not found in reference');
  }

  if (!versePart) {
    return {
      book: bookPart,
      chapter: 1,
    };
  }

  const [chapter, verseRange] = versePart.split(':');

  if (!chapter) {
    throw new Error('Chapter not found in reference');
  }

  if (!verseRange) {
    return {
      book: bookPart,
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
    book: bookPart,
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

export function chapterCount(version: BibleVersion, bookName: string): number {
  if (!BIBLE_VERSIONS.includes(version)) {
    throw new Error(`Invalid Bible version: ${version}. Available versions: ${BIBLE_VERSIONS.join(', ')}`);
  }

  const bibleData = getBibleData(version);
  const book = bibleData[bookName.toLowerCase()];

  if (!book) {
    throw new Error(`Book not found: ${bookName}`);
  }

  let count = 0;
  Object.keys(book).forEach(chapter => {
    if (chapter !== 'name' && chapter !== 'order' && chapter !== 'chapter_number') {
      count++;
    }
  });

  return count;
}

export function versesCount(version: BibleVersion, bookName: string, chapter: number): number {
  if (!BIBLE_VERSIONS.includes(version)) {
    throw new Error(`Invalid Bible version: ${version}. Available versions: ${BIBLE_VERSIONS.join(', ')}`);
  }

  const bibleData = getBibleData(version);
  const book = bibleData[bookName.toLowerCase()];

  if (!book) {
    throw new Error(`Book not found: ${bookName}`);
  }

  const chapterData = book[chapter.toString()] as Record<string, string>;
  if (!chapterData) {
    throw new Error(`Chapter not found: ${chapter}`);
  }

  return Object.keys(chapterData).length;
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