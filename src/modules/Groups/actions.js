import axios from 'axios';
import { replace } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_GROUPS_PENDING,
  FETCH_GROUPS_REJECTED,
  FETCH_GROUPS_FULFILLED,
  FETCH_GROUP_PENDING,
  FETCH_GROUP_FULFILLED,
  FETCH_GROUP_REJECTED,
  CREATE_GROUP_PENDING,
  CREATE_GROUP_FULFILLED,
  CREATE_GROUP_REJECTED,
  DELETE_GROUP_PENDING,
  DELETE_GROUP_FULFILLED,
  DELETE_GROUP_REJECTED,
  UPDATE_GROUP_PENDING,
  UPDATE_GROUP_FULFILLED,
  UPDATE_GROUP_REJECTED,
  FETCH_USERS_PENDING,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED,
  ADD_GROUP_MEMBER_PENDING,
  ADD_GROUP_MEMBER_FULFILLED,
  ADD_GROUP_MEMBER_REJECTED,
  REMOVE_GROUP_MEMBER_PENDING,
  REMOVE_GROUP_MEMBER_FULFILLED,
  REMOVE_GROUP_MEMBER_REJECTED,
  SELECTED_GROUPS,
  GROUP_EDIT_UNLOADED,
  GROUPS_UNLOADED,
  GROUP_MEMBERS_UNLOADED,
  FILTER_AVAILABLE_USERS_TEXT,
  FILTER_MEMBER_USERS_TEXT
} from './actionTypes';

function fixProperties(data) {
  // TODO: https://gitlab.com/galacticfog/gestalt-meta/issues/163
  const payload = { ...data };

  if (!payload.properties) {
    payload.properties = { users: [] };
  }

  return payload;
}

export function onUnloadGroup() {
  return (dispatch) => {
    dispatch({ type: GROUP_EDIT_UNLOADED });
  };
}

export function onUnloadGroups() {
  return (dispatch) => {
    dispatch({ type: GROUPS_UNLOADED });
  };
}

export function onUnloadGroupMembers() {
  return (dispatch) => {
    dispatch({ type: GROUP_MEMBERS_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_GROUPS, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_GROUPS, payload };
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

export function fetchGroups(fqon) {
  const url = `/${fqon}/groups`;

  return (dispatch) => {
    dispatch({ type: FETCH_GROUPS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_GROUPS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_GROUPS_REJECTED, payload: err });
    });
  };
}

export function fetchGroup(fqon, groupId) {
  return (dispatch) => {
    dispatch({ type: FETCH_GROUP_PENDING });
    axios.get(`${fqon}/groups/${groupId}`).then((response) => {
      dispatch({ type: FETCH_GROUP_FULFILLED, payload: fixProperties(response.data) });
    }).catch((err) => {
      dispatch({ type: FETCH_GROUP_REJECTED, payload: err });
    });
  };
}

export function createGroup(fqon, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_GROUP_PENDING });
    axios.post(`${fqon}/groups`, payload).then((response) => {
      dispatch({ type: CREATE_GROUP_FULFILLED, payload: response.data });
      dispatch(replace(`${fqon}/groups/${response.data.id}/edit`));
    }).catch((err) => {
      dispatch({ type: CREATE_GROUP_REJECTED, payload: err });
    });
  };
}

export function updateGroup(fqon, groupId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_GROUP_PENDING });
    axios.patch(`${fqon}/groups/${groupId}`, patches).then((response) => {
      dispatch({ type: UPDATE_GROUP_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: UPDATE_GROUP_REJECTED, payload: err });
    });
  };
}

export function deleteGroup(fqon, groupId) {
  return (dispatch) => {
    dispatch({ type: DELETE_GROUP_PENDING });
    axios.delete(`${fqon}/groups/${groupId}?force=true`).then(() => {
      dispatch({ type: DELETE_GROUP_FULFILLED });
      dispatch(fetchGroups(fqon));
    }).catch((err) => {
      dispatch({ type: DELETE_GROUP_REJECTED, payload: err });
    });
  };
}

export function deleteGroups(groupIds, fqon) {
  return (dispatch) => {
    dispatch({ type: DELETE_GROUP_PENDING });
    const all = groupIds.map(item => axios.delete(`${fqon}/groups/${item}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_GROUP_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchGroups(fqon));
    }).catch((err) => {
      dispatch({ type: DELETE_GROUP_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}

export function fetchUsers(fqon) {
  const url = `/${fqon}/users`;

  return (dispatch) => {
    dispatch({ type: FETCH_USERS_PENDING });
    axios.get(`${url}`).then((response) => {
      dispatch({ type: FETCH_USERS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_USERS_REJECTED, payload: err });
    });
  };
}

export function addGroupMember(fqon, groupId, userId) {
  return (dispatch) => {
    dispatch({ type: ADD_GROUP_MEMBER_PENDING });
    axios.patch(`${fqon}/groups/${groupId}/users?id=${userId}`, []).then(() => {
      axios.get(`${fqon}/groups/${groupId}?expand=true`).then((response) => {
        dispatch({ type: ADD_GROUP_MEMBER_FULFILLED, payload: fixProperties(response.data) });
        dispatch(clearMemberUsersFilter());
      });
    }).catch((err) => {
      dispatch({ type: ADD_GROUP_MEMBER_REJECTED, payload: err });
    });
  };
}

export function removeGroupMember(fqon, groupId, userId) {
  return (dispatch) => {
    dispatch({ type: REMOVE_GROUP_MEMBER_PENDING });
    axios.delete(`${fqon}/groups/${groupId}/users?id=${userId}`).then(() => {
      axios.get(`${fqon}/groups/${groupId}?expand=true`).then((response) => {
        dispatch({ type: REMOVE_GROUP_MEMBER_FULFILLED, payload: fixProperties(response.data) });
        dispatch(clearAvailableUsersFilter());
      });
    }).catch((err) => {
      dispatch({ type: REMOVE_GROUP_MEMBER_REJECTED, payload: err });
    });
  };
}

