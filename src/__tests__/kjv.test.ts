import { getVerses, listBooks, countVerses, chapterCount, versesCount } from '../index';

describe('KJV Bible Version Tests', () => {
  describe('getVerses', () => {
    it('should get a single verse using full book name', () => {
      const result = getVerses('kjv', 'genesis 1:1');
      expect(result.reference).toBe('genesis 1:1');
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
    });

    it('should get verses from numbered books using full name', () => {
      const result = getVerses('kjv', '1 corinthians 2:4');
      expect(result.reference).toBe('1 corinthians 2:4');
      expect(result.verses['4']).toContain('And my speech and my preaching');
    });

    it('should get a verse range', () => {
      const result = getVerses('kjv', 'genesis 1:1-2');
      expect(result.reference).toBe('genesis 1:1-2');
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
      expect(result.verses['2']).toBe('2. And the earth was without form, and void; and darkness {was} upon the face of the deep. And the Spirit of God moved upon the face of the waters.');
    });

    it('should get multiple verses', () => {
      const result = getVerses('kjv', 'genesis 1:1,3');
      expect(result.reference).toBe('genesis 1:1,3');
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
      expect(result.verses['3']).toBe('3. And God said, Let there be light: and there was light.');
    });

    it('should get an entire chapter', () => {
      const result = getVerses('kjv', 'genesis 1');
      expect(result.reference).toBe('genesis 1');
      expect(Object.keys(result.verses).length).toBeGreaterThan(0);
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
    });
  });

  describe('listBooks', () => {
    it('should list all books', () => {
      const books = listBooks('kjv');
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      expect(books).toContain('genesis');
      expect(books).toContain('john');
    });
  });

  describe('Verse Counting', () => {
    it('should count verses in Genesis', () => {
      expect(countVerses('kjv', 'genesis')).toBeGreaterThan(0);
      expect(chapterCount('kjv', 'genesis')).toBeGreaterThan(0);
      expect(versesCount('kjv', 'genesis', 1)).toBeGreaterThan(0);
    });

    it('should count verses in Psalms', () => {
      expect(countVerses('kjv', 'psalms')).toBeGreaterThan(0);
      expect(chapterCount('kjv', 'psalms')).toBeGreaterThan(0);
      expect(versesCount('kjv', 'psalms', 119)).toBeGreaterThan(0);
    });
  });
}); 