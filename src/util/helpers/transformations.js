import { map } from 'lodash';

export function arrayToMap(array, keyName = 'name', valueName = 'value') {
  return Object.assign({}, ...array.map(v => ({ [v[keyName]]: v[valueName] })));
}

export function mapTo2DArray(object, keyName = 'name', valueName = 'value') {
  return map(object, (value, key) => ({ [keyName]: key, [valueName]: value }));
}
