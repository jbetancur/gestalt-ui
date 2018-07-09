/**
 * getItem
 * @param {*} key
 */
export const getItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return undefined;
  }
};

/**
 * saveItem
 * @param {*} key
 * @param {*} value
 */
export const saveItem = (key, value) => {
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
