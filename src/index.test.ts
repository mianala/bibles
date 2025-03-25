import { fetchVerses } from './index';

describe('fetchVerses', () => {
  // Test single verse references
  describe('single verse references', () => {
    it('should fetch NIV verses correctly', async () => {
      const result = await fetchVerses('niv', 'john 3:16');
      expect(result.reference).toBe('john 3:16');
      expect(result.verses['16']).toBeDefined();
      expect(result.verses['16']).toContain('For God so loved the world');
    });

    it('should fetch LSG verses correctly', async () => {
      const result = await fetchVerses('lsg', 'romains 8:28');
      expect(result.reference).toBe('romains 8:28');
      expect(result.verses['28']).toBeDefined();
    });

    it('should fetch KJV verses correctly', async () => {
      const result = await fetchVerses('kjv', 'john 3:16');
      expect(result.reference).toBe('john 3:16');
      expect(result.verses['16']).toBeDefined();
      expect(result.verses['16']).toContain('For God so loved the world');
    });

    it('should fetch ASV verses correctly', async () => {
      const result = await fetchVerses('asv', 'john 3:16');
      expect(result.reference).toBe('john 3:16');
      expect(result.verses['16']).toBeDefined();
    });
  });

  // Test verse ranges
  describe('verse ranges', () => {
    it('should fetch NIV verse range correctly', async () => {
      const result = await fetchVerses('niv', 'john 3:16-17');
      expect(result.reference).toBe('john 3:16-17');
      expect(result.verses['16']).toBeDefined();
      expect(result.verses['17']).toBeDefined();
    });

    it('should fetch KJV verse range correctly', async () => {
      const result = await fetchVerses('kjv', 'john 3:16-17');
      expect(result.reference).toBe('john 3:16-17');
      expect(result.verses['16']).toBeDefined();
      expect(result.verses['17']).toBeDefined();
    });
  });

  // Test numbered books
  describe('numbered books', () => {
    it('should fetch NIV numbered book correctly', async () => {
      const result = await fetchVerses('niv', '1 john 4:7');
      expect(result.reference).toBe('1 john 4:7');
      expect(result.verses['7']).toBeDefined();
    });

    it('should fetch LSG numbered book correctly', async () => {
      const result = await fetchVerses('lsg', '1 corinthiens 13:4');
      expect(result.reference).toBe('1 corinthiens 13:4');
      expect(result.verses['4']).toBeDefined();
    });
  });

  // Test chapter references
  describe('chapter references', () => {
    it('should fetch NIV chapter correctly', async () => {
      const result = await fetchVerses('niv', 'psalms 23');
      expect(result.reference).toBe('psalms 23');
      expect(Object.keys(result.verses).length).toBeGreaterThan(0);
      expect(result.verses['1']).toBeDefined();
    });

    it('should fetch KJV chapter correctly', async () => {
      const result = await fetchVerses('kjv', 'psalms 23');
      expect(result.reference).toBe('psalms 23');
      expect(Object.keys(result.verses).length).toBeGreaterThan(0);
      expect(result.verses['1']).toBeDefined();
    });
  });

  // Test error cases
  describe('error cases', () => {
    it('should throw error for unsupported version', async () => {
      await expect(fetchVerses('invalid', 'john 3:16')).rejects.toThrow(
        'Unsupported Bible version: invalid'
      );
    });

    it('should throw error for invalid reference', async () => {
      await expect(fetchVerses('niv', 'invalid')).rejects.toThrow();
    });

    it('should throw error for non-existent verse', async () => {
      await expect(fetchVerses('niv', 'john 3:999')).rejects.toThrow();
    });
  });
}); 