import map from 'lodash/map';
import compact from 'lodash/compact';
import get from 'lodash/get';

/**
 * arrayToMap
 * @param {*} array
 * @param {*} keyName
 * @param {*} valueName
 */
export function arrayToMap(array = [], keyName = 'name', valueName = 'value') {
  if (!Array.isArray(array)) {
    return array;
  }

  return Object.assign({}, ...array.map(v => ({ [v[keyName]]: v[valueName] || '' })));
}

/**
 * mapTo2DArray
 * @param {*} object
 * @param {*} keyName
 * @param {*} valueName
 * @param {*} mergeSet
 */
export function mapTo2DArray(object = {}, keyName = 'name', valueName = 'value', mergeSet = {}) {
  if (typeof object !== 'object') {
    return object;
  }

  return map(object, (value, key) => (Object.assign({ [keyName]: key, [valueName]: value || '' }, mergeSet)));
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
 * used to convert env vars from a map to an array and reconcile inherited vs own
 * @param {*} own
 * @param {*} inherited
 */
export function convertFromMaps(own = {}, inherited = {}, keyName = 'name', valueName = 'value') {
  const ownVars = mapTo2DArray(own, keyName, valueName, { inherited: false });

  // base case just return the mapped own vars
  if (!Object.keys(inherited)) {
    return ownVars;
  }

  const inheritedVars = mapTo2DArray(inherited, keyName, valueName, { inherited: true, overridden: false });

  const reconcileInheritedVars = inheritedVars.map((i) => {
    // find the dupe value in ownVars
    const index = ownVars.findIndex(o => o[keyName] === i[keyName]);

    // if the value is differnt mark the matching var as overriden
    if (index > -1 && ownVars[index][valueName] !== i[valueName]) {
      return { ...i, [valueName]: ownVars[index][valueName], inherited: true, overridden: true };
    }

    // default case the own env var
    return i;
  });

  const results = [...reconcileInheritedVars];

  // "merge" the ownVars back in
  ownVars.forEach((v) => {
    const index = inheritedVars.findIndex(o => o[keyName] === v[keyName]);

    if (index === -1) {
      results.push(v);
    }
  });

  return results;
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
