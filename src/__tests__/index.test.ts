import {
  getVerses,
  listBooks,
  chapterCount,
  versesCount,
  countVerses,
  type BibleVersion,
} from '../index';

describe('Bible Functions', () => {
  describe('getVerses', () => {
    it('should get verses from MG version', () => {
      const result = getVerses('mg', 'johany 3:16');
      expect(result.reference).toBe('johany 3:16');
      expect(result.verses['16']).toBe('16. Fa izany no fitiavana Andriamanitra tamin\'izao tontolo izao: dia ny nanome ny Zanany tokana, mba tsy ho very izay rehetra mino Azy, fa hanana fiainana mandrakizay.');
    });

    it('should get verses from DIEM version', () => {
      const result = getVerses('diem', 'johany 3:16');
      expect(result.reference).toBe('johany 3:16');
      expect(result.verses['16']).toBe('16. Fa izany no fitiavana Andriamanitra tamin\'izao tontolo izao: dia ny nanome ny Zanany tokana, mba tsy ho very izay rehetra mino Azy, fa hanana fiainana mandrakizay.');
    });

    it('should get verses from KJV version', () => {
      const result = getVerses('kjv', 'gn 1:1');
      expect(result.reference).toBe('gn 1:1');
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
    });

    it('should get verses from APEE version', () => {
      const result = getVerses('apee', 'gn 1:1');
      expect(result.reference).toBe('gn 1:1');
      expect(result.verses['1']).toBe('1. Dieu, au commencement, créa les cieux et la terre;');
    });

    it('should handle verse ranges', () => {
      const result = getVerses('kjv', 'gn 1:1-2');
      expect(result.reference).toBe('gn 1:1-2');
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
      expect(result.verses['2']).toBe('2. And the earth was without form, and void; and darkness {was} upon the face of the deep. And the Spirit of God moved upon the face of the waters.');
    });

    it('should handle multiple verses', () => {
      const result = getVerses('kjv', 'gn 1:1,3');
      expect(result.reference).toBe('gn 1:1,3');
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
      expect(result.verses['3']).toBe('3. And God said, Let there be light: and there was light.');
    });

    it('should get entire chapter when no verses specified', () => {
      const result = getVerses('kjv', 'gn 1');
      expect(result.reference).toBe('gn 1');
      expect(Object.keys(result.verses).length).toBeGreaterThan(0);
      expect(result.verses['1']).toBe('1. In the beginning God created the heaven and the earth.');
    });

    it('should throw error for invalid version', () => {
      expect(() => getVerses('invalid' as BibleVersion, 'john 3:16')).toThrow('Invalid Bible version');
    });

    it('should throw error for invalid book', () => {
      expect(() => getVerses('kjv', 'invalid 3:16')).toThrow('Book not found');
    });

    it('should throw error for invalid chapter', () => {
      expect(() => getVerses('kjv', 'gn 999:16')).toThrow('Chapter not found');
    });

    it('should throw error for invalid verse', () => {
      expect(() => getVerses('kjv', 'gn 1:999')).toThrow('Verse not found');
    });
  });

  describe('listBooks', () => {
    it('should list books for MG version', () => {
      const books = listBooks('mg');
      expect(books).toContain('johany');
      expect(books).toContain('genesisy');
      expect(books.length).toBeGreaterThan(0);
    });

    it('should list books for DIEM version', () => {
      const books = listBooks('diem');
      expect(books).toContain('johany');
      expect(books).toContain('genesisy');
      expect(books.length).toBeGreaterThan(0);
    });

    it('should list books for KJV version', () => {
      const books = listBooks('kjv');
      expect(books).toContain('gn');
      expect(books.length).toBeGreaterThan(0);
    });

    it('should list books for APEE version', () => {
      const books = listBooks('apee');
      expect(books).toContain('gn');
      expect(books.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid version', () => {
      expect(() => listBooks('invalid' as BibleVersion)).toThrow('Invalid Bible version');
    });
  });

  describe('chapterCount', () => {
    it('should get chapter count for MG version', () => {
      expect(chapterCount('mg', 'johany')).toBe(21);
    });

    it('should get chapter count for DIEM version', () => {
      expect(chapterCount('diem', 'johany')).toBe(21);
    });

    it('should get chapter count for KJV version', () => {
      expect(chapterCount('kjv', 'gn')).toBe(50);
    });

    it('should get chapter count for APEE version', () => {
      expect(chapterCount('apee', 'gn')).toBe(50);
    });

    it('should throw error for invalid version', () => {
      expect(() => chapterCount('invalid' as BibleVersion, 'john')).toThrow('Invalid Bible version');
    });

    it('should throw error for invalid book', () => {
      expect(() => chapterCount('kjv', 'invalid')).toThrow('Book not found');
    });
  });

  describe('versesCount', () => {
    it('should get verse count for MG version', () => {
      expect(versesCount('mg', 'johany', 3)).toBe(36);
    });

    it('should get verse count for DIEM version', () => {
      expect(versesCount('diem', 'johany', 3)).toBe(36);
    });

    it('should get verse count for KJV version', () => {
      expect(versesCount('kjv', 'gn', 1)).toBe(31);
    });

    it('should get verse count for APEE version', () => {
      expect(versesCount('apee', 'gn', 1)).toBe(31);
    });

    it('should throw error for invalid version', () => {
      expect(() => versesCount('invalid' as BibleVersion, 'john', 3)).toThrow('Invalid Bible version');
    });

    it('should throw error for invalid book', () => {
      expect(() => versesCount('kjv', 'invalid', 3)).toThrow('Book not found');
    });

    it('should throw error for invalid chapter', () => {
      expect(() => versesCount('kjv', 'gn', 999)).toThrow('Chapter not found');
    });
  });

  describe('countVerses', () => {
    it('should get total verse count for MG version', () => {
      expect(countVerses('mg', 'johany')).toBe(879);
    });

    it('should get total verse count for DIEM version', () => {
      expect(countVerses('diem', 'johany')).toBe(879);
    });

    it('should get total verse count for KJV version', () => {
      expect(countVerses('kjv', 'gn')).toBe(1533);
    });

    it('should get total verse count for APEE version', () => {
      expect(countVerses('apee', 'gn')).toBe(1533);
    });

    it('should throw error for invalid version', () => {
      expect(() => countVerses('invalid' as BibleVersion, 'john')).toThrow('Invalid Bible version');
    });

    it('should throw error for invalid book', () => {
      expect(() => countVerses('kjv', 'invalid')).toThrow('Book not found');
    });
  });
}); 