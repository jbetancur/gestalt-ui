import {
  getLastFromSplit,
  truncate,
  toTitleCase,
  removeHostFromURL,
  isBase64,
} from './strings';

describe('Util Transformations', () => {
  describe('getLastFromSplit function', () => {
    it('should return the last split item of a delmited string with the default "::" delimiter', () => {
      const string = 'This::is::a::String!';

      expect(getLastFromSplit(string)).toBe('String!');
    });

    it('should return the last split item of a delmited string with a customer delimiter', () => {
      const string = 'This,is,a,String!';

      expect(getLastFromSplit(string, ',')).toBe('String!');
    });

    it('should not return anything if no string is provided', () => {
      expect(getLastFromSplit(null)).toBe(null);
    });
  });

  describe('truncate function', () => {
    it('should truncate and trim a string with the default trailing format', () => {
      const string = 'This is possibly the longest string ever convievable to man';

      expect(truncate(string, 5)).toBe('This...');
    });

    it('should truncate and trim a string with a custom trailing format', () => {
      const string = 'This is possibly the longest string ever convievable to man';

      expect(truncate(string, 5, '***')).toBe('This***');
    });

    it('should not truncate and trim a string if it is less than the max chars', () => {
      const string = 'shorty';

      expect(truncate(string, 20)).toBe('shorty');
    });
  });

  describe('toTitleCase function', () => {
    it('should convert a sentence to title case', () => {
      const string = 'the worlds most stable genuis';

      expect(toTitleCase(string)).toBe('The Worlds Most Stable Genuis');
    });
  });

  describe('removeHostFromURL function', () => {
    it('should remove the host with a port from a url', () => {
      const url = 'http://localhost:7001/gfi/galacticfog.com';

      expect(removeHostFromURL(url)).toBe('gfi/galacticfog.com');
    });

    it('should remove the host without a port from a url', () => {
      const url = 'https://gtw1.test.galacticfog.com/jb/upgrade-all-the-things';

      expect(removeHostFromURL(url)).toBe('jb/upgrade-all-the-things');
    });
  });

  describe('isBase64 function', () => {
    it('should return true if valid base64', () => {
      expect(isBase64('aGVsbG8gd29ybGQ=')).toBe(true);
    });

    it('should rreturn false if invalid base64', () => {
      expect(isBase64('hello world')).toBe(false);
    });
  });
});
