import { getVerses, listBooks, countVerses, chapterCount, versesCount } from '../index';

describe('Bible API Tests', () => {
  describe('getVerses', () => {
    it('should return a single verse', () => {
      const result = getVerses('mg', 'jaona 3:16');
      expect(result).toBeDefined();
      expect(result.reference).toBeDefined();
      expect(result.verses).toBeDefined();
      expect(Object.keys(result.verses).length).toBe(1);
    });

    it('should return a verse range', () => {
      const result = getVerses('diem', 'jaona 3:16-18');
      expect(result).toBeDefined();
      expect(result.reference).toBeDefined();
      expect(result.verses).toBeDefined();
      expect(Object.keys(result.verses).length).toBe(3);
    });

    it('should return multiple verses', () => {
      const result = getVerses('mg', 'jaona 3:16,18');
      expect(result).toBeDefined();
      expect(result.reference).toBeDefined();
      expect(result.verses).toBeDefined();
      expect(Object.keys(result.verses).length).toBe(2);
    });

    it('should return a whole chapter', () => {
      const result = getVerses('diem', 'jaona 3');
      expect(result).toBeDefined();
      expect(result.reference).toBeDefined();
      expect(result.verses).toBeDefined();
      expect(Object.keys(result.verses).length).toBeGreaterThan(1);
    });
  });

  describe('listBooks', () => {
    it('should list all books in MG version', () => {
      const books = listBooks('mg');
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });
  });

  describe('Verse Counting', () => {
    it('should count verses in Jaona', () => {
      expect(countVerses('mg', 'jaona')).toBeGreaterThan(0);
      expect(chapterCount('mg', 'jaona')).toBeGreaterThan(0);
      expect(versesCount('mg', 'jaona', 3)).toBeGreaterThan(0);
    });

    it('should count verses in Psalms', () => {
      expect(countVerses('mg', 'salamo')).toBeGreaterThan(0);
      expect(chapterCount('mg', 'salamo')).toBeGreaterThan(0);
      expect(versesCount('mg', 'salamo', 119)).toBeGreaterThan(0);
    });
  });
}); 