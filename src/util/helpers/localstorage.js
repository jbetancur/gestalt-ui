export const loadStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return undefined;
  }
};

export const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // ignore write errors
  }

  return undefined;
};
