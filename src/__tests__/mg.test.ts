import { getVerses, listBooks, countVerses, chapterCount, versesCount } from '../index';

describe('MG Bible Version Tests', () => {
  describe('getVerses', () => {
    it('should get a single verse', () => {
      const result = getVerses('mg', 'jaona 3:16');
      expect(result.reference).toBe('jaona 3:16');
      expect(Object.keys(result.verses).length).toBe(1);
    });

    it('should get a verse range', () => {
      const result = getVerses('mg', 'jaona 3:16-18');
      expect(result.reference).toBe('jaona 3:16-18');
      expect(Object.keys(result.verses).length).toBe(3);
    });

    it('should get multiple verses', () => {
      const result = getVerses('mg', 'jaona 3:16,18');
      expect(result.reference).toBe('jaona 3:16,18');
      expect(Object.keys(result.verses).length).toBe(2);
    });

    it('should get an entire chapter', () => {
      const result = getVerses('mg', 'jaona 3');
      expect(result.reference).toBe('jaona 3');
      expect(Object.keys(result.verses).length).toBeGreaterThan(1);
    });
  });

  describe('listBooks', () => {
    it('should list all books', () => {
      const books = listBooks('mg');
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      expect(books).toContain('jaona');
      expect(books).toContain('genesisy');
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