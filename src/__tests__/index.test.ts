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
      const result = getVerses('mg', 'jaona 3:16');
      expect(result.reference).toBe('jaona 3:16');
      expect(result.verses['16']).toBe('16. Fa toy izao no nitiavan\' Andriamanitra izao tontolo izao: nomeny ny Zanani-lahy Tokana, mba tsy ho very izay rehetra mino Azy, fa hanana fiainana mandrakizay.');
    });

    it('should get verses from DIEM version', () => {
      const result = getVerses('diem', 'jaona 3:16');
      expect(result.reference).toBe('jaona 3:16');
      expect(result.verses['16']).toBe('16. "Fa tena tia an\'izao tontolo izao Andriamanitra ka nanome an\'ilay Zanany lahitokana, mba tsy ho ringana izay rehetra maneho finoana azy, fa hahazo fiainana mandrakizay.');
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
      expect(books).toContain('jaona');
      expect(books).toContain('genesisy');
      expect(books.length).toBeGreaterThan(0);
    });

    it('should list books for DIEM version', () => {
      const books = listBooks('diem');
      expect(books).toContain('jaona');
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
}); 