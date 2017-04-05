import { toggleHandler } from 'util/helpers/lists';
import {
  SELECTED_GROUPS,
  SELECTED_GROUPS_CLEAR,
  FILTER_AVAILABLE_USERS_TEXT,
  FILTER_MEMBER_USERS_TEXT
} from './actionTypes';

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_GROUPS, payload };
}

export function clearSelected() {
  return { type: SELECTED_GROUPS_CLEAR };
}

export function filterAvailableUsers(predicate) {
  return (dispatch) => {
    dispatch({ type: FILTER_AVAILABLE_USERS_TEXT, filterText: predicate });
  };
}

export function clearAvailableUsersFilter() {
  return (dispatch) => {
    dispatch({ type: FILTER_AVAILABLE_USERS_TEXT, filterText: '' });
  };
}

export function filterMemberUsers(predicate) {
  return (dispatch) => {
    dispatch({ type: FILTER_MEMBER_USERS_TEXT, filterText: predicate });
  };
}

export function clearMemberUsersFilter() {
  return (dispatch) => {
    dispatch({ type: FILTER_MEMBER_USERS_TEXT, filterText: '' });
  };
}

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Groups',
        multipleItems,
        onProceed: action,
      }
    });
  };
}
