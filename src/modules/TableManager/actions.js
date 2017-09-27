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
 * @param {*} count
 * @param {*} list
 * @param {*} items
 */
export function handleTableSelected(row, toggled, count, list, items) {
  // TODO: row indexes are off buy 1 in react-md DataTable https://github.com/mlaursen/react-md/issues/243
  const rowIndex = row - 1;
  const payload = {
    count,
    showTitle: count <= 0,
    items: toggleHandler(rowIndex, toggled, count, items, list)
  };

  return { type: 'tableManager/SELECTED_ROWS', payload };
}

/**
 * tableActions.handleTableSortIcon
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
