# mg-bibles

A package for accessing Bible verses in Malagasy (MG), Diem, King James (KJV), and Louis Segond (APEE) versions. This package is actively maintained as it's a core dependency of [Stage](https://stage.loha.dev/sh/k1sry6), the ultimate app for performers, musicians, and artists.

## Installation

```bash
npm install mg-bibles
```

## Usage

```typescript
import { getVerses, listBooks, countVerses, chapterCount, versesCount } from 'mg-bibles';

// Get specific verses from MG version
const verses = getVerses('mg', 'jaona 3:16');
console.log(verses);
// Output: { reference: 'jaona 3:16', verses: { '16': '16. For God so loved the world...' } }

// Get verses from KJV version using full book name
const kjvVerses = getVerses('kjv', 'genesis 1:1');
console.log(kjvVerses);
// Output: { reference: 'genesis 1:1', verses: { '1': '1. In the beginning God created...' } }

// Get verses from KJV version using abbreviation
const kjvAbbr = getVerses('kjv', 'gn 1:1');
console.log(kjvAbbr);
// Output: { reference: 'gn 1:1', verses: { '1': '1. In the beginning God created...' } }

// Get verses from APEE version using full book name
const apeVerses = getVerses('apee', 'genesis 1:1');
console.log(apeVerses);
// Output: { reference: 'genesis 1:1', verses: { '1': '1. Dieu, au commencement...' } }

// Get verses from APEE version using abbreviation
const apeAbbr = getVerses('apee', 'gn 1:1');
console.log(apeAbbr);
// Output: { reference: 'gn 1:1', verses: { '1': '1. Dieu, au commencement...' } }

// Get a range of verses
const range = getVerses('diem', 'jaona 3:16-18');
console.log(range);
// Output: { reference: 'jaona 3:16-18', verses: { '16': '16. For God so loved...', '17': '17. For God did not...', '18': '18. Whoever believes...' } }

// Get multiple specific verses
const multiple = getVerses('mg', 'jaona 3:16,18');
console.log(multiple);
// Output: { reference: 'jaona 3:16,18', verses: { '16': '16. For God so loved...', '18': '18. Whoever believes...' } }

// Get a whole chapter
const chapter = getVerses('diem', 'jaona 3');
console.log(chapter);
// Output: { reference: 'jaona 3', verses: { '1': '1. Now there was...', '2': '2. This man came...', ... } }

// List all books in a version
const books = listBooks('mg');
console.log(books);
// Output: ['amosa', 'apokalypsy', 'asa', 'daniela', ...]

// Count total verses in a book
const totalVerses = countVerses('mg', 'jaona');
console.log(totalVerses);
// Output: 879

// Get number of chapters in a book
const chapters = chapterCount('mg', 'jaona');
console.log(chapters);
// Output: 21

// Count verses in a specific chapter
const versesInChapter = versesCount('mg', 'jaona', 3);
console.log(versesInChapter);
// Output: 36
```

## API

### getVerses(version: BibleVersion, reference: string)

Returns verses from the specified Bible version based on the reference string.

#### Parameters
- `version`: The Bible version to use ('mg', 'diem', 'kjv', or 'apee')
- `reference`: A string in the format "book chapter:verse" or "book chapter:verse-verse" or "book chapter:verse,verse"

#### Returns
An object containing:
- `reference`: The original reference string
- `verses`: An object mapping verse numbers to their text

#### Supported Reference Formats
- Single verse: `"jaona 3:16"` (MG/DIEM) or `"genesis 1:1"` / `"gn 1:1"` (KJV/APEE)
- Verse range: `"jaona 3:16-18"` or `"genesis 1:1-2"` / `"gn 1:1-2"`
- Multiple verses: `"jaona 3:16,18"` or `"genesis 1:1,3"` / `"gn 1:1,3"`
- Whole chapter: `"jaona 3"` or `"genesis 1"` / `"gn 1"`

Note: For KJV and APEE versions, both full book names and standard abbreviations are supported (e.g., "genesis" or "gn" for Genesis).

### listBooks(version: BibleVersion)

Returns an array of all book names available in the specified Bible version.

#### Parameters
- `version`: The Bible version to use ('mg' or 'diem')

#### Returns
An array of strings containing book names, sorted alphabetically with proper handling of numbered books.

### countVerses(version: BibleVersion, bookName: string)

Returns the total number of verses in a specific book.

#### Parameters
- `version`: The Bible version to use ('mg' or 'diem')
- `bookName`: The name of the book to count verses from (case-insensitive)

#### Returns
A number representing the total count of verses in the specified book.

Example:
```typescript
countVerses('mg', 'jaona') // returns 879
countVerses('mg', 'salamo') // returns 2461
```

### chapterCount(version: BibleVersion, bookName: string)

Returns the number of chapters in a specific book.

#### Parameters
- `version`: The Bible version to use ('mg' or 'diem')
- `bookName`: The name of the book to count chapters from (case-insensitive)

#### Returns
A number representing the total count of chapters in the specified book.

Example:
```typescript
chapterCount('mg', 'jaona') // returns 21
chapterCount('mg', 'salamo') // returns 150
```

### versesCount(version: BibleVersion, bookName: string, chapter: number)

Returns the number of verses in a specific chapter of a book.

#### Parameters
- `version`: The Bible version to use ('mg' or 'diem')
- `bookName`: The name of the book (case-insensitive)
- `chapter`: The chapter number

#### Returns
A number representing the count of verses in the specified chapter.

Example:
```typescript
versesCount('mg', 'jaona', 3) // returns 36
versesCount('mg', 'salamo', 119) // returns 176
```

## Types

```typescript
type BibleVersion = 'mg' | 'diem' | 'kjv' | 'apee';

type VerseReference = {
  book: string;
  chapter: number;
  verses?: number[];
};
```

## License

MIT

## Used By

This package is a core dependency of [Stage](https://stage.loha.dev/sh/k1sry6), the ultimate app for performers, musicians, and artists. Stage uses mg-bibles to provide clear lyrics display and easy access to biblical content for church musicians and performers. 