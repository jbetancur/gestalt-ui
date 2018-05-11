import { map, sortBy, compact, unionBy, orderBy, get } from 'lodash';

/**
 * arrayToMap
 * @param {*} array
 * @param {*} keyName
 * @param {*} valueName
 */
export function arrayToMap(array, keyName = 'name', valueName = 'value') {
  return Object.assign({}, ...array.map(v => ({ [v[keyName]]: v[valueName] })));
}

/**
 * mapTo2DArray
 * @param {*} object
 * @param {*} keyName
 * @param {*} valueName
 * @param {*} mergeSet
 */
export function mapTo2DArray(object, keyName = 'name', valueName = 'value', mergeSet = {}) {
  const mappedItems = map(object, (value, key) => (Object.assign({ [keyName]: key, [valueName]: value }, mergeSet)));
  return sortBy(mappedItems, [v => v[keyName].toLowerCase()]);
}

/**
 * stringDemiltedToArray
 * convert comma delimited string to an array and remove blank entries
 * @param {*} string
 */
export function stringDemiltedToArray(string) {
  return compact(string.split(','));
}

/**
 * convertFromMaps
 * used to convert env vars from a map to an array
 * @param {*} own
 * @param {*} inherited
 */
export function convertFromMaps(own = {}, inherited = {}, keyName = 'name', valueName = 'value') {
  // vars are a map but we need arrays to work with forms and for additional attributes for inheritance
  const inheritedVars = mapTo2DArray(inherited, keyName, valueName, { inherited: true });
  const ownVars = mapTo2DArray(own, keyName, valueName, { inherited: false });

  return orderBy(unionBy(ownVars, inheritedVars, keyName), ['inherited', keyName], 'desc');
}

/**
 * Builds an object from a delimited string
 * @param {String} string
 * @param {String} delimiter
 */
export function nestedObjectFromString(string, value = null, delimeter = '.') {
  const [last, ...paths] = string.split(delimeter).reverse();
  return paths.reduce((acc, el) => ({ [el]: acc }), { [last]: value });
}


export const getRoutePattern = (object, urlPattern) => {
  const keys = [];

  urlPattern.split('/').forEach((item) => {
    const search = item.startsWith(':');

    if (search) {
      keys.push(get(object, item.slice(1)));
    } else {
      keys.push(item);
    }
  });

  return keys.join('/');
};
