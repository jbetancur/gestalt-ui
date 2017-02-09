import axios from 'axios';
import { push } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_USERS_PENDING,
  FETCH_USERS_REJECTED,
  FETCH_USERS_FULFILLED,
  FETCH_USER_PENDING,
  FETCH_USER_FULFILLED,
  FETCH_USER_REJECTED,
  CREATE_USER_PENDING,
  CREATE_USER_FULFILLED,
  CREATE_USER_REJECTED,
  DELETE_USER_PENDING,
  DELETE_USER_FULFILLED,
  DELETE_USER_REJECTED,
  UPDATE_USER_PENDING,
  UPDATE_USER_FULFILLED,
  UPDATE_USER_REJECTED,
  FETCH_ALLORGS_PENDING,
  FETCH_ALLORGS_FULFILLED,
  FETCH_ALLORGS_REJECTED,
  SELECTED_USERS,
  USER_UNLOADED,
  USERS_UNLOADED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: USER_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: USERS_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_USERS, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_USERS, payload };
}

export function fetchUsers(fqon) {
  const url = `/${fqon}/users`;

  return (dispatch) => {
    dispatch({ type: FETCH_USERS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_USERS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_USERS_REJECTED, payload: err });
    });
  };
}

export function fetchUser(fqon, userId) {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_PENDING });
    axios.get(`${fqon}/users/${userId}`).then((response) => {
      dispatch({ type: FETCH_USER_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_USER_REJECTED, payload: err });
    });
  };
}

export function createUser(fqon, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_USER_PENDING });
    axios.post(`${fqon}/users`, payload).then((response) => {
      dispatch({ type: CREATE_USER_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/users`));
    }).catch((err) => {
      dispatch({ type: CREATE_USER_REJECTED, payload: err });
    });
  };
}

export function updateUser(fqon, userId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_PENDING });
    axios.patch(`${fqon}/users/${userId}`, patches).then((response) => {
      dispatch({ type: UPDATE_USER_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/users`));
    }).catch((err) => {
      dispatch({ type: UPDATE_USER_REJECTED, payload: err });
    });
  };
}

export function deleteUser(fqon, userId) {
  return (dispatch) => {
    dispatch({ type: DELETE_USER_PENDING });
    axios.delete(`${fqon}/users/${userId}?force=true`).then(() => {
      dispatch({ type: DELETE_USER_FULFILLED });
      dispatch(fetchUsers(fqon));
    }).catch((err) => {
      dispatch({ type: DELETE_USER_REJECTED, payload: err });
    });
  };
}

export function fetchAllOrgs(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_ALLORGS_PENDING });

    function getOrg() {
      return axios.get(fqon);
    }

    function getSubOrgs() {
      return axios.get(`${fqon}/orgs?expand=true`);
    }

    axios.all([getOrg(), getSubOrgs()]).then(axios.spread((org, subOrgs) => {
      const values = subOrgs.data.map(item => ({ name: item.name, value: item.properties.fqon }));
      values.unshift({ name: org.data.name, value: org.data.properties.fqon });

      dispatch({ type: FETCH_ALLORGS_FULFILLED, payload: values });
    })).catch((err) => {
      dispatch({ type: FETCH_ALLORGS_REJECTED, payload: err });
    });
  };
}

export function deleteUsers(userIds, fqon) {
  return (dispatch) => {
    dispatch({ type: DELETE_USER_PENDING });
    const all = userIds.map(item => axios.delete(`${fqon}/users/${item}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_USER_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchUsers(fqon));
    }).catch((err) => {
      dispatch({ type: DELETE_USER_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}
