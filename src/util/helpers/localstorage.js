/**
 * loadStorage
 * @param {*} key
 */
export const loadStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return undefined;
  }
};

/**
 * saveStorage
 * @param {*} key
 * @param {*} value
 */
export const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // ignore write errors
  }

  return undefined;
};

/**
 * removeItem
 * @param {*} key
 * @param {*} value
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // ignore write errors
  }

  return undefined;
};

