import axios from 'axios';
import { push, replace } from 'react-router-redux';
import {
  FETCH_WORKSPACES_PENDING,
  FETCH_WORKSPACES_REJECTED,
  FETCH_WORKSPACES_FULFILLED,
  FETCH_WORKSPACE_PENDING,
  FETCH_WORKSPACE_REJECTED,
  FETCH_WORKSPACE_FULFILLED,
  CREATE_WORKSPACE_PENDING,
  CREATE_WORKSPACE_FULFILLED,
  CREATE_WORKSPACE_REJECTED,
  UPDATE_WORKSPACE_PENDING,
  UPDATE_WORKSPACE_FULFILLED,
  UPDATE_WORKSPACE_REJECTED,
  DELETE_WORKSPACE_PENDING,
  DELETE_WORKSPACE_FULFILLED,
  DELETE_WORKSPACE_REJECTED
} from './actionTypes';

export function fetchWorkspaces(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_WORKSPACES_PENDING });
    axios.get(`/${fqon}/workspaces?expand=true`).then((response) => {
      dispatch({ type: FETCH_WORKSPACES_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_WORKSPACES_REJECTED, payload: err });
    });
  };
}

export function fetchWorkspace(fqon, workspaceId) {
  return (dispatch) => {
    dispatch({ type: FETCH_WORKSPACE_PENDING });
    axios.get(`/${fqon}/workspaces/${workspaceId}`).then((response) => {
      dispatch({ type: FETCH_WORKSPACE_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_WORKSPACE_REJECTED, payload: err });
    });
  };
}

export function createWorkspace(fqon, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_WORKSPACE_PENDING });
    axios.post(`/${fqon}/workspaces`, payload).then((response) => {
      const { id } = response.data;

      dispatch({ type: CREATE_WORKSPACE_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/workspaces/${id}`));
    }).catch((err) => {
      dispatch({ type: CREATE_WORKSPACE_REJECTED, payload: err });
    });
  };
}

export function updateWorkspace(fqon, workspaceId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_WORKSPACE_PENDING });
    axios.patch(`${fqon}/workspaces/${workspaceId}`, patches).then((response) => {
      dispatch({ type: UPDATE_WORKSPACE_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/workspaces/${workspaceId}`));
    }).catch((err) => {
      dispatch({ type: UPDATE_WORKSPACE_REJECTED, payload: err });
    });
  };
}

export function deleteWorkspace(fqon, workspaceId) {
  return (dispatch) => {
    dispatch({ type: DELETE_WORKSPACE_PENDING });
    axios.delete(`/${fqon}/workspaces/${workspaceId}?force=true`).then(() => {
      dispatch({ type: DELETE_WORKSPACE_FULFILLED });
      dispatch(replace(`${fqon}/workspaces`));
    }).catch((err) => {
      dispatch({ type: DELETE_WORKSPACE_REJECTED, payload: err });
    });
  };
}


export default { fetchWorkspaces, fetchWorkspace, createWorkspace, updateWorkspace, deleteWorkspace };
