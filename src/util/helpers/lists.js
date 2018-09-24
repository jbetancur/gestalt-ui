export function insertItem(array, payload) {
  return [...array, payload];
}

export function removeItem(array, payload) {
  const newArray = array.slice();
  newArray.splice(newArray.findIndex(a => a === payload), 1);

  return newArray;
}

export function removeItemById(array, id) {
  const newArray = array.slice();
  newArray.splice(newArray.findIndex(a => a.id === id), 1);

  return newArray;
}

export function updateItem(array, payload) {
  return array.map((item) => {
    if (item.id === payload.id) {
      return {
        ...payload,
      };
    }

    // Leave every other item unchanged
    return item;
  });
}
