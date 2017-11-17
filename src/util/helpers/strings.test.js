import {
  getParentFQON,
  getLastFromSplit,
  truncate,
} from './strings';

describe('Util Transformations', () => {
  describe('getParentFQON function', () => {
    it('should return an fqon from a url string', () => {
      const obj = { org: { href: 'http://test.com:8080/whatever' } };

      expect(getParentFQON(obj)).to.equal('whatever');
    });
  });

  describe('getLastFromSplit function', () => {
    it('should return the last split item of a delmited string with the default "::" delimiter', () => {
      const string = 'This::is::a::String!';

      expect(getLastFromSplit(string)).to.equal('String!');
    });

    it('should return the last split item of a delmited string with a customer delimiter', () => {
      const string = 'This,is,a,String!';

      expect(getLastFromSplit(string, ',')).to.equal('String!');
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
  });
});
