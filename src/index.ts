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

// Add new API interfaces
interface BibleAPIResponse {
  reference: string;
  verses: {
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
  text: string;
  translation_name: string;
}

interface BibleTextResponse {
  reference: string;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

async function fetchExternalVerse(version: string, reference: string) {
  // Normalize reference to lowercase
  const normalizedReference = reference.toLowerCase();
  const response = await fetch(`https://bible-api.com/${normalizedReference}?translation=${version}`);

  if (!response.ok) {
    throw new Error('Failed to fetch verse 🚫');
  }

  const data: BibleAPIResponse | BibleTextResponse = await response.json();

  // Handle text-only response (KJV, ASV)
  if (!('verses' in data)) {
    console.log('📖 Received text-only response');
    // Split text into verses by sentences
    const verses = data.text
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .reduce(
        (acc, text, index) => {
          const verseNum = (index + 1).toString();
          acc[verseNum] = `${verseNum}. ${text.trim()}`;
          return acc;
        },
        {} as Record<string, string>
      );

    return {
      reference: normalizedReference,
      verses,
    };
  }

  // Handle verses array response
  const verses = data.verses.reduce(
    (acc, verse) => {
      acc[verse.verse.toString()] = `${verse.verse}. ${verse.text.trim()}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    reference: normalizedReference,
    verses,
  };
}

async function fetchBibleToolVerse(version: string, reference: string) {
  // Normalize reference to lowercase for processing
  const normalizedReference = reference.toLowerCase();
  const [bookPart, versePart] = normalizedReference.split(' ');
  let bookCode: string;

  const cleanBookName = (name: string) => name.replace(/\s+/g, '').toLowerCase();

  if (/^\d/.test(bookPart)) {
    const [num, ...nameParts] = normalizedReference.split(' ');
    const name = cleanBookName(nameParts[0]);
    if (name.startsWith('phil')) {
      bookCode = name.slice(0, 5);
    } else {
      bookCode = name.slice(0, 3);
    }
    bookCode = `${num}${bookCode}`;
  } else {
    const name = cleanBookName(bookPart);
    if (name.startsWith('phil')) {
      bookCode = name.slice(0, 5);
    } else {
      bookCode = name.slice(0, 3);
    }
  }

  const formattedVersion = version === 'niv' ? 'niv' : 'lsg';
  const formattedReference = `${formattedVersion}-${bookCode}/${versePart}`;

  const response = await fetch(`http://ibibles.net/quote.php?${formattedReference}`);

  if (!response.ok) {
    throw new Error('Failed to fetch verse 🚫');
  }

  const html = await response.text();

  // Handle error responses
  if (html.includes('Invalid syntax') || html.includes('Bible verse not found')) {
    throw new Error('Verse not found or invalid reference 📭');
  }

  const verses = {} as Record<string, string>;

  // Updated regex to handle both formats
  const verseRegex = /<small>(\d+:\d+)<\/small>\s*([^<]+)(?:\s*<br>|\s*$)/g;

  let match;
  while ((match = verseRegex.exec(html)) !== null) {
    const [, reference, text] = match;
    const verseNum = reference.split(':')[1];
    const cleanText = text
      .trim()
      .replace(/^["']|["']$/g, '') // Remove quotes at start/end
      .replace(/\s+/g, ' '); // Normalize whitespace
    verses[verseNum] = `${verseNum}. ${cleanText}`;
  }

  if (Object.keys(verses).length === 0) {
    console.log('🔍 No verses found in HTML:', html);
    throw new Error('No verses found in response 📭');
  }

  return {
    reference: normalizedReference,
    verses,
  };
}

export async function fetchVerses(version: string, reference: string) {
  // Handle Bible Tool API versions (NIV and LSG)
  if (version === 'niv' || version === 'lsg') {
    return fetchBibleToolVerse(version, reference);
  }
  
  // Handle Bible API versions (KJV and ASV)
  if (version === 'kjv' || version === 'asv') {
    return fetchExternalVerse(version, reference);
  }

  throw new Error(`Unsupported Bible version: ${version}. Supported versions are: niv, lsg, kjv, asv`);
}

export type { BibleVersion, VerseReference }; 