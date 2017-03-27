import axios from 'axios';
import { push, replace } from 'react-router-redux';
import {
  CREATE_WORKSPACE_PENDING,
  CREATE_WORKSPACE_FULFILLED,
  CREATE_WORKSPACE_REJECTED,
  UPDATE_WORKSPACE_PENDING,
  UPDATE_WORKSPACE_FULFILLED,
  UPDATE_WORKSPACE_REJECTED,
  DELETE_WORKSPACE_PENDING,
  DELETE_WORKSPACE_FULFILLED,
  DELETE_WORKSPACE_REJECTED,
  WORKSPACES_NAVIGATION,
  WORKSPACE_UNLOADED,
  WORKSPACES_UNLOADED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: WORKSPACE_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: WORKSPACES_UNLOADED });
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

export function handleNavigation(view, index) {
  const payload = {
    view,
    index
  };

  return { type: WORKSPACES_NAVIGATION, payload };
}

export function confirmDelete(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Are you sure you want to delete the ${item} Workspace?`,
        body: `All items within ${item} will be deleted. This action cannot be undone.`,
        onProceed: action,
      }
    });
  };
}
