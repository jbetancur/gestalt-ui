import {
  getLastFromSplit,
  truncate,
  toTitleCase,
  removeHostFromURL,
} from './strings';

describe('Util Transformations', () => {
  describe('getLastFromSplit function', () => {
    it('should return the last split item of a delmited string with the default "::" delimiter', () => {
      const string = 'This::is::a::String!';

      expect(getLastFromSplit(string)).to.equal('String!');
    });

    it('should return the last split item of a delmited string with a customer delimiter', () => {
      const string = 'This,is,a,String!';

      expect(getLastFromSplit(string, ',')).to.equal('String!');
    });

    it('should not return anything if no string is provided', () => {
      expect(getLastFromSplit(null)).to.equal(null);
    });
  });

  describe('truncate function', () => {
    it('should truncate and trim a string with the default trailing format', () => {
      const string = 'This is possibly the longest string ever convievable to man';

      expect(truncate(string, 5)).to.equal('This...');
    });

    it('should truncate and trim a string with a custom trailing format', () => {
      const string = 'This is possibly the longest string ever convievable to man';

      expect(truncate(string, 5, '***')).to.equal('This***');
    });

    it('should not truncate and trim a string if it is less than the max chars', () => {
      const string = 'shorty';

      expect(truncate(string, 20)).to.equal('shorty');
    });
  });

  describe('toTitleCase function', () => {
    it('should convert a sentence to title case', () => {
      const string = 'the worlds most stable genuis';

      expect(toTitleCase(string)).to.equal('The Worlds Most Stable Genuis');
    });
  });

  describe('removeHostFromURL function', () => {
    it('should remove the host with a port from a url', () => {
      const url = 'http://localhost:7001/gfi/galacticfog.com';

      expect(removeHostFromURL(url)).to.equal('gfi/galacticfog.com');
    });

    it('should remove the host without a port from a url', () => {
      const url = 'https://gtw1.test.galacticfog.com/jb/upgrade-all-the-things';

      expect(removeHostFromURL(url)).to.equal('jb/upgrade-all-the-things');
    });
  });
});
