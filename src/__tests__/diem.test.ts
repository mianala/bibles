import { getVerses, listBooks, countVerses, chapterCount, versesCount } from '../index';

describe('DIEM Bible Version Tests', () => {
  describe('getVerses', () => {
    it('should get a single verse', () => {
      const result = getVerses('diem', 'jaona 3:16');
      expect(result.reference).toBe('jaona 3:16');
      expect(Object.keys(result.verses).length).toBe(1);
    });

    it('should get a verse range', () => {
      const result = getVerses('diem', 'jaona 3:16-18');
      expect(result.reference).toBe('jaona 3:16-18');
      expect(Object.keys(result.verses).length).toBe(3);
    });

    it('should get multiple verses', () => {
      const result = getVerses('diem', 'jaona 3:16,18');
      expect(result.reference).toBe('jaona 3:16,18');
      expect(Object.keys(result.verses).length).toBe(2);
    });

    it('should get an entire chapter', () => {
      const result = getVerses('diem', 'jaona 3');
      expect(result.reference).toBe('jaona 3');
      expect(Object.keys(result.verses).length).toBeGreaterThan(1);
    });
  });

  describe('listBooks', () => {
    it('should list all books', () => {
      const books = listBooks('diem');
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      expect(books).toContain('jaona');
      expect(books).toContain('genesisy');
    });
  });

  describe('Verse Counting', () => {
    it('should count verses in Jaona', () => {
      expect(countVerses('diem', 'jaona')).toBeGreaterThan(0);
      expect(chapterCount('diem', 'jaona')).toBeGreaterThan(0);
      expect(versesCount('diem', 'jaona', 3)).toBeGreaterThan(0);
    });

    it('should count verses in Psalms', () => {
      expect(countVerses('diem', 'salamo')).toBeGreaterThan(0);
      expect(chapterCount('diem', 'salamo')).toBeGreaterThan(0);
      expect(versesCount('diem', 'salamo', 119)).toBeGreaterThan(0);
    });
  });
}); 