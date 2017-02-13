import axios from 'axios';
import { replace } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_POLICIES_PENDING,
  FETCH_POLICIES_REJECTED,
  FETCH_POLICIES_FULFILLED,
  POLICY_UNLOADED,
  POLICIES_UNLOADED,
  SELECTED_POLICIES,
  FETCH_POLICY_PENDING,
  FETCH_POLICY_FULFILLED,
  FETCH_POLICY_REJECTED,
  CREATE_POLICY_PENDING,
  CREATE_POLICY_FULFILLED,
  CREATE_POLICY_REJECTED,
  UPDATE_POLICY_PENDING,
  UPDATE_POLICY_FULFILLED,
  UPDATE_POLICY_REJECTED,
  DELETE_POLICY_PENDING,
  DELETE_POLICY_FULFILLED,
  DELETE_POLICY_REJECTED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: POLICY_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: POLICIES_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_POLICIES, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_POLICIES, payload };
}

export function fetchPolicies(fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: FETCH_POLICIES_PENDING });
    axios.get(`/${fqon}/environments/${environmentId}/policies?expand=true`).then((response) => {
      dispatch({ type: FETCH_POLICIES_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_POLICIES_REJECTED, payload: err });
    });
  };
}

export function fetchPolicy(fqon, policyId) {
  return (dispatch) => {
    dispatch({ type: FETCH_POLICY_PENDING });
    axios.get(`${fqon}/policies/${policyId}`).then((response) => {
      dispatch({ type: FETCH_POLICY_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_POLICY_REJECTED, payload: err });
    });
  };
}

export function createPolicy(fqon, workspaceId, environmentId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_POLICY_PENDING });
    axios.post(`${fqon}/environments/${environmentId}/policies`, payload).then((response) => {
      dispatch({ type: CREATE_POLICY_FULFILLED, payload: response.data });
      dispatch(replace(`${fqon}/workspaces/${workspaceId}/environments/${environmentId}`));
    }).catch((err) => {
      dispatch({ type: CREATE_POLICY_REJECTED, payload: err });
    });
  };
}

export function updatePolicy(fqon, workspaceId, environmentId, policyId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_POLICY_PENDING });
    axios.patch(`${fqon}/policies/${policyId}`, patches).then((response) => {
      dispatch({ type: UPDATE_POLICY_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: UPDATE_POLICY_REJECTED, payload: err });
    });
  };
}

export function deletePolicy(fqon, policyId) {
  return (dispatch) => {
    dispatch({ type: DELETE_POLICY_PENDING });
    axios.delete(`${fqon}/policies/${policyId}?force=true`).then(() => {
      dispatch({ type: DELETE_POLICY_FULFILLED });
    }).catch((err) => {
      dispatch({ type: DELETE_POLICY_REJECTED, payload: err });
    });
  };
}

export function deletePolicies(policyIds, fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: DELETE_POLICY_PENDING });
    const all = policyIds.map(item => axios.delete(`${fqon}/policies/${item}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_POLICY_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchPolicies(fqon, environmentId));
    }).catch((err) => {
      dispatch({ type: DELETE_POLICY_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}
