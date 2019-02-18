import {
  arrayToMap,
  mapTo2DArray,
  convertFromMaps,
  stringDemiltedToArray,
  nestedObjectFromString,
  getRoutePattern,
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
    it('should return the correct values when no variables are inherited', () => {
      const own = { luke_skywalker: 'jedi', darth_vadar: 'sith lord' };

      expect(convertFromMaps(own)).toEqual([
        { name: 'luke_skywalker', value: 'jedi', inherited: false },
        { name: 'darth_vadar', value: 'sith lord', inherited: false },
      ]);
    });

    it('should return the correct values when variables are inherited', () => {
      const own = { luke_skywalker: 'jedi', darth_vadar: 'sith lord' };
      const inherited = { leia: 'princess', han_solo: 'nerf herder' };

      expect(convertFromMaps(own, inherited)).toEqual([
        { name: 'leia', value: 'princess', inherited: true, overridden: false },
        { name: 'han_solo', value: 'nerf herder', inherited: true, overridden: false },
        { name: 'luke_skywalker', value: 'jedi', inherited: false },
        { name: 'darth_vadar', value: 'sith lord', inherited: false },
      ]);
    });

    it('should return the correct values when variables are inherited and overriden', () => {
      const own = { luke_skywalker: 'jedi', darth_vadar: 'sith lord' };
      const inherited = { leia: 'princess', han_solo: 'smuggler', darth_vadar: 'sith master' };

      expect(convertFromMaps(own, inherited)).toEqual([
        { name: 'leia', value: 'princess', inherited: true, overridden: false },
        { name: 'han_solo', value: 'smuggler', inherited: true, overridden: false },
        { name: 'darth_vadar', value: 'sith lord', inherited: true, overridden: true },
        { name: 'luke_skywalker', value: 'jedi', inherited: false },
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

  describe('nestedObjectFromString function', () => {
    it('should create create a nested object from a string', () => {
      const string = 'luke.skywalker.is.awesome';
      expect(nestedObjectFromString(string)).toEqual({ luke: { skywalker: { is: { awesome: null } } } });
    });

    it('should create create a nested object from a string with a value', () => {
      const string = 'luke.skywalker.is.awesome';
      expect(nestedObjectFromString(string, 'with the force')).toEqual({ luke: { skywalker: { is: { awesome: 'with the force' } } } });
    });

    it('should create create a nested object with an overriden delimiter', () => {
      const string = 'luke:skywalker:is:awesome';
      expect(nestedObjectFromString(string, null, ':')).toEqual({ luke: { skywalker: { is: { awesome: null } } } });
    });
  });

  describe('getRoutePattern function', () => {
    it('should create a valid url path with no props', () => {
      const pattern = '/smuggler';

      expect(getRoutePattern({}, pattern)).toBe('/smuggler');
    });

    it('should create a valid url path with non nested props', () => {
      const pattern = '/:han/:solo/smuggler';
      const object = {
        han: 'nerf',
        solo: 'herding',
      };

      expect(getRoutePattern(object, pattern)).toBe('/nerf/herding/smuggler');
    });

    it('should create a valid url path with nested props', () => {
      const pattern = '/:hero.han/:hero.solo/smuggler';
      const object = {
        hero: {
          han: 'nerf',
          solo: 'herding',
        }
      };

      expect(getRoutePattern(object, pattern)).toBe('/nerf/herding/smuggler');
    });
  });
});
