# mg-bibles

A package for accessing Bible verses in Malagasy and Diem versions.

## Installation

```bash
npm install mg-bibles
```

## Usage

```typescript
import { getVerses } from 'mg-bibles';

// Get specific verses
const verses = getVerses('mg', 'jaona 3:16');
console.log(verses);
// Output: { reference: 'jaona 3:16', verses: { '16': '16. For God so loved the world...' } }

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
```

## API

### getVerses(version: BibleVersion, reference: string)

Returns verses from the specified Bible version based on the reference string.

#### Parameters

- `version`: The Bible version to use ('mg' or 'diem')
- `reference`: A string in the format "book chapter:verse" or "book chapter:verse-verse" or "book chapter:verse,verse"

#### Returns

An object containing:
- `reference`: The original reference string
- `verses`: An object mapping verse numbers to their text

#### Supported Reference Formats

- Single verse: `"jaona 3:16"`
- Verse range: `"jaona 3:16-18"`
- Multiple verses: `"jaona 3:16,18"`
- Whole chapter: `"jaona 3"`

## Types

```typescript
type BibleVersion = 'mg' | 'diem';

type VerseReference = {
  book: string;
  chapter: number;
  verses?: number[];
};
``` 