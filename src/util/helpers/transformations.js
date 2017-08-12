import { map, sortBy } from 'lodash';

export function arrayToMap(array, keyName = 'name', valueName = 'value') {
  return Object.assign({}, ...array.map(v => ({ [v[keyName]]: v[valueName] })));
}

export function mapTo2DArray(object, keyName = 'name', valueName = 'value', mergeSet = {}) {
  const mappedItems = map(object, (value, key) => (Object.assign({ [keyName]: key, [valueName]: value }, mergeSet)));
  return sortBy(mappedItems, [v => v[keyName].toLowerCase()]);
}
