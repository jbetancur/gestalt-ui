export function sort(arr, key, ascending) {
  const list = arr.slice();
  const multiplier = ascending ? 1 : -1;

  list.sort((prev, curr) => {
    const v1 = prev[key];
    const v2 = curr[key];

    if (typeof v1 === 'number') {
      return v1 < v2 ? 1 : -1;
    }

    return v1.localeCompare(v2) * multiplier;
  });

  return list;
}

export function insertItem(array, item) {
  return [...array, item];
}

export function removeItem(array, item) {
  const newArray = array.slice();
  newArray.splice(newArray.findIndex(a => a === item), 1);

  return newArray;
}

export function removeItemById(array, id) {
  const newArray = array.slice();
  newArray.splice(newArray.findIndex(a => a.id === id), 1);

  return newArray;
}

export function toggleHandler(row, toggled, count, selectedItems, allItems) {
  if (row > -1 && toggled) {
    return insertItem(selectedItems, allItems[row]);
  }

  if (row > -1 && !toggled) {
    return removeItem(selectedItems, allItems[row]);
  }

  if (count === allItems.length && toggled) {
    return allItems;
  }

  if (count === 0 && !toggled) {
    return [];
  }

  return [];
}
