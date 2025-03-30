import { getVerses, listBooks, countVerses, chapterCount, versesCount } from '../index';

describe('APEE Bible Version Tests', () => {
  describe('getVerses', () => {
    it('should get a single verse using full book name', () => {
      const result = getVerses('apee', 'genesis 1:1');
      expect(result.reference).toBe('genesis 1:1');
      expect(result.verses['1']).toBe('1. Dieu, au commencement, créa les cieux et la terre;');
    });


    it('should get verses from numbered books using full name', () => {
      const result = getVerses('apee', '1 corinthiens 2:4');
      expect(result.reference).toBe('1 corinthiens 2:4');
      expect(result.verses['4']).toContain('ma parole et ma prédication');
    });

    it('should get a verse range', () => {
      const result = getVerses('apee', 'genesis 1:1-2');
      expect(result.reference).toBe('genesis 1:1-2');
      expect(result.verses['1']).toBe('1. Dieu, au commencement, créa les cieux et la terre;');
      expect(result.verses['2']).toContain('La terre était informe et vide');
    });

    it('should get multiple verses', () => {
      const result = getVerses('apee', 'genesis 1:1,3');
      expect(result.reference).toBe('genesis 1:1,3');
      expect(result.verses['1']).toBe('1. Dieu, au commencement, créa les cieux et la terre;');
      expect(result.verses['3']).toContain('Dieu dit: Que la lumière soit');
    });

    it('should get an entire chapter', () => {
      const result = getVerses('apee', 'genesis 1');
      expect(result.reference).toBe('genesis 1');
      expect(Object.keys(result.verses).length).toBeGreaterThan(0);
      expect(result.verses['1']).toBe('1. Dieu, au commencement, créa les cieux et la terre;');
    });
  });

  describe('listBooks', () => {
    it('should list all books', () => {
      const books = listBooks('apee');
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      expect(books).toContain('genesis');
      expect(books).toContain('jean');
    });
  });

  describe('Verse Counting', () => {
    it('should count verses in Genesis', () => {
      expect(countVerses('apee', 'genesis')).toBeGreaterThan(0);
      expect(chapterCount('apee', 'genesis')).toBeGreaterThan(0);
      expect(versesCount('apee', 'genesis', 1)).toBeGreaterThan(0);
    });

    it('should count verses in Psalms', () => {
      expect(countVerses('apee', 'psaumes')).toBeGreaterThan(0);
      expect(chapterCount('apee', 'psaumes')).toBeGreaterThan(0);
      expect(versesCount('apee', 'psaumes', 119)).toBeGreaterThan(0);
    });
  });
}); 