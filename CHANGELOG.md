# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-03-20

### Added
- New `chapterCount(version: BibleVersion, bookName: string)` function to get the number of chapters in a book
- New `versesCount(version: BibleVersion, bookName: string, chapter: number)` function to count verses in a specific chapter

### Changed
- Modified `countVerses` function to return only the total verse count instead of an object with verse and chapter counts

## [1.1.0] - 2024-03-20

### Added
- New `listBooks(version: BibleVersion)` function to get all books in a Bible version
- Improved book sorting in `listBooks` to handle numbered books (e.g., 1-samoela, 2-samoela)

## [1.0.0] - 2024-03-20

### Added
- Initial release
- `getVerses(version: BibleVersion, reference: string)` function to get Bible verses
- Support for both Malagasy (mg) and Diem Bible versions
- Support for various reference formats:
  - Single verse (e.g., "jaona 3:16")
  - Verse range (e.g., "jaona 3:16-18")
  - Multiple verses (e.g., "jaona 3:16,18")
  - Whole chapter (e.g., "jaona 3")
- TypeScript type definitions 