import axios from 'axios';
import { push, replace } from 'react-router-redux';
import {
  CREATE_ENVIRONMENT_PENDING,
  CREATE_ENVIRONMENT_FULFILLED,
  CREATE_ENVIRONMENT_REJECTED,
  UPDATE_ENVIRONMENT_PENDING,
  UPDATE_ENVIRONMENT_FULFILLED,
  UPDATE_ENVIRONMENT_REJECTED,
  DELETE_ENVIRONMENT_PENDING,
  DELETE_ENVIRONMENT_FULFILLED,
  DELETE_ENVIRONMENT_REJECTED,
  ENVIRONMENTS_NAVIGATION,
  ENVIRONMENT_UNLOADED,
  ENVIRONMENTS_UNLOADED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: ENVIRONMENT_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: ENVIRONMENTS_UNLOADED });
  };
}

export function createEnvironment(fqon, workspaceId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_ENVIRONMENT_PENDING });
    axios.post(`/${fqon}/workspaces/${workspaceId}/environments`, payload).then((response) => {
      const { id, properties } = response.data;

      dispatch({ type: CREATE_ENVIRONMENT_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/workspaces/${properties.workspace.id}/environments/${id}`));
    }).catch((err) => {
      dispatch({ type: CREATE_ENVIRONMENT_REJECTED, payload: err });
    });
  };
}

export function updateEnvironment(fqon, environmentId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_ENVIRONMENT_PENDING });
    axios.patch(`${fqon}/environments/${environmentId}`, patches).then((response) => {
      const { properties } = response.data;

      dispatch({ type: UPDATE_ENVIRONMENT_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/workspaces/${properties.workspace.id}/environments/${environmentId}`));
    }).catch((err) => {
      dispatch({ type: UPDATE_ENVIRONMENT_REJECTED, payload: err });
    });
  };
}

export function deleteEnvironment(fqon, environmentId, workspaceId) {
  return (dispatch) => {
    dispatch({ type: DELETE_ENVIRONMENT_PENDING });
    axios.delete(`/${fqon}/environments/${environmentId}?force=true`).then(() => {
      dispatch({ type: DELETE_ENVIRONMENT_FULFILLED });
      dispatch(replace(`${fqon}/workspaces/${workspaceId}`));
    }).catch((err) => {
      dispatch({ type: DELETE_ENVIRONMENT_REJECTED, payload: err });
    });
  };
}

export function handleNavigation(view, index) {
  const payload = {
    view,
    index
  };

  return { type: ENVIRONMENTS_NAVIGATION, payload };
}

export function confirmDelete(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Are you sure you want to delete the ${item} Environment?`,
        body: `All items within ${item} will be deleted. This action cannot be undone.`,
        onProceed: action,
      }
    });
  };
}
