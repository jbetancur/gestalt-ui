import { toggleHandler } from 'util/helpers/lists';

/**
 * clearTableSort
 */
export function clearTableSort() {
  return { type: 'tableManager/CLEAR_SORT' };
}

/**
 * clearTableSelected
 */
export function clearTableSelected() {
  return { type: 'tableManager/CLEAR_SELECTED_ROWS' };
}

/**
 * sortTable
 * @param {string} key - the property key to sort
 */
export function sortTable(key) {
  return (dispatch) => {
    dispatch({ type: 'tableManager/SORT_COLUMN', key });
  };
}

/**
 * handleTableSelected
 * @param {*} row
 * @param {*} toggled
 * @param {*} selectedCount
 * @param {*} list
 * @param {*} selectedItems
 */
export function handleTableSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: 'tableManager/SELECTED_ROWS', payload };
}

/**
 * handleTableSortIcon
 * handle sort icon for React-md DataTabless
 * @param {string} compareKey
 * @param {bool} isDefaultKey
 */
export function handleTableSortIcon(compareKey, isDefaultKey) {
  return (dispatch, getState) => {
    const { key, order } = getState().tableManager.tableSort;

    if (isDefaultKey && !key) {
      return order === 'asc';
    }

    if (compareKey === key) {
      return order === 'asc';
    }

    return undefined;
  };
}

export default {
  sortTable,
  clearTableSort,
  clearTableSelected,
  handleTableSelected,
  handleTableSortIcon,
};
