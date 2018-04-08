import {
  arrayToMap,
  mapTo2DArray,
  convertFromMaps,
  stringDemiltedToArray,
} from './transformations';

describe('Util Transformations', () => {
  describe('arrayToMap function', () => {
    it('should map an array to a key value pair', () => {
      const array = [{ name: 'luke skywalker', value: 'awesome' }];

      expect(arrayToMap(array)).toEqual({ 'luke skywalker': 'awesome' });
    });

    it('should map an array to a key value with custom key value names', () => {
      const array = [{ fname: 'luke', lname: 'skywalker', address: 'tatooine' }];

      expect(arrayToMap(array, 'fname', 'address')).toEqual({ luke: 'tatooine' });
    });
  });

  describe('mapTo2DArray function', () => {
    it('should create an array from a map', () => {
      const obj = { 'luke skywalker': 'awesome' };

      expect(mapTo2DArray(obj)).toEqual([{ name: 'luke skywalker', value: 'awesome' }]);
    });

    it('should create an array from a map with custom key value names', () => {
      const obj = { 'luke skywalker': 'awesome' };

      expect(mapTo2DArray(obj, 'fullname', 'status')).toEqual([{ fullname: 'luke skywalker', status: 'awesome' }]);
    });
  });

  describe('convertFromMaps function', () => {
    it('should return the correct values', () => {
      const own = { luke_skywalker: 'jedi' };
      const inherited = { darth_vadar: 'sith' };

      expect(convertFromMaps(own, inherited)).toEqual([
        { name: 'darth_vadar', value: 'sith', inherited: true },
        { name: 'luke_skywalker', value: 'jedi', inherited: false }
      ]);
    });

    it('should return the correct values when own and inherited have the same values', () => {
      const own = { luke_skywalker: 'jedi', darth_vadar: 'sith lord' };
      const inherited = { darth_vadar: 'sith' };

      expect(convertFromMaps(own, inherited)).toEqual([
        { name: 'darth_vadar', value: 'sith lord', inherited: false },
        { name: 'luke_skywalker', value: 'jedi', inherited: false }
      ]);
    });
  });

  describe('stringDemiltedToArray function', () => {
    it('should create convert string delimited to an array', () => {
      const string = 'luke,skywalker,is,awesome';

      expect(stringDemiltedToArray(string)).toEqual(['luke', 'skywalker', 'is', 'awesome']);
    });

    it('should create convert string delimited to an array and remove/compact blank elements', () => {
      const string = 'luke,skywalker,is,,awesome';

      expect(stringDemiltedToArray(string)).toEqual(['luke', 'skywalker', 'is', 'awesome']);
    });
  });
});
