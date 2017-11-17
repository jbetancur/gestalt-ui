import { map, sortBy, compact } from 'lodash';

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
