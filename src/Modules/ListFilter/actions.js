export function setFilter(filter = 'SHOW_ALL', filterText = '') {
  return {
    type: 'SET_VISIBILITY_FILTER', filter, filterText,
  };
}

export function setFilterDebounced(filter = 'SHOW_ALL', filterText = '') {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter,
    filterText,
    meta: {
      debounce: {
        time: 300,
      },
    },
  };
}

export function clearFilterText() {
  return {
    type: 'CLEAR_VISIBILITY_FILTERTEXT',
  };
}

export default {
  setFilter,
  setFilterDebounced,
  clearFilterText,
};
