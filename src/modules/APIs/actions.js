import axios from 'axios';
import { replace } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_APIS_PENDING,
  FETCH_APIS_REJECTED,
  FETCH_APIS_FULFILLED,
  API_UNLOADED,
  APIS_UNLOADED,
  SELECTED_APIS,
  FETCH_API_PENDING,
  FETCH_API_FULFILLED,
  FETCH_API_REJECTED,
  CREATE_API_PENDING,
  CREATE_API_FULFILLED,
  CREATE_API_REJECTED,
  UPDATE_API_PENDING,
  UPDATE_API_FULFILLED,
  UPDATE_API_REJECTED,
  DELETE_API_PENDING,
  DELETE_API_FULFILLED,
  DELETE_API_REJECTED,
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: API_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: APIS_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_APIS, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_APIS, payload };
}

export function fetchAPIs(fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: FETCH_APIS_PENDING });
    axios.get(`/${fqon}/environments/${environmentId}/apis?expand=true`).then((response) => {
      dispatch({ type: FETCH_APIS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_APIS_REJECTED, payload: err });
    });
  };
}

export function fetchAPI(fqon, apiId) {
  return (dispatch) => {
    dispatch({ type: FETCH_API_PENDING });
    axios.get(`${fqon}/apis/${apiId}`).then((response) => {
      dispatch({ type: FETCH_API_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_API_REJECTED, payload: err });
    });
  };
}

export function createAPI(fqon, workspaceId, environmentId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_API_PENDING });
    axios.post(`${fqon}/environments/${environmentId}/apis`, payload).then((response) => {
      dispatch({ type: CREATE_API_FULFILLED, payload: response.data });
      dispatch(replace(`${fqon}/workspaces/${workspaceId}/environments/${environmentId}/apis/${response.data.id}/edit`));
    }).catch((err) => {
      dispatch({ type: CREATE_API_REJECTED, payload: err });
    });
  };
}

export function updateAPI(fqon, workspaceId, environmentId, apiId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_API_PENDING });
    axios.patch(`${fqon}/apis/${apiId}`, patches).then((response) => {
      dispatch({ type: UPDATE_API_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: UPDATE_API_REJECTED, payload: err });
    });
  };
}

export function deleteAPI(fqon, apiId) {
  return (dispatch) => {
    dispatch({ type: DELETE_API_PENDING });
    axios.delete(`${fqon}/apis/${apiId}?force=true`).then(() => {
      dispatch({ type: DELETE_API_FULFILLED });
    }).catch((err) => {
      dispatch({ type: DELETE_API_REJECTED, payload: err });
    });
  };
}

export function deleteAPIs(apiIds, fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: DELETE_API_PENDING });
    const all = apiIds.map(item => axios.delete(`${fqon}/apis/${item}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_API_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchAPIs(fqon, environmentId));
    }).catch((err) => {
      dispatch({ type: DELETE_API_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}

export function fetchProviders(fqon, environmentId, providerType) {
  const type = providerType ? `?type=${providerType}` : '';

  return (dispatch) => {
    dispatch({ type: FETCH_PROVIDERS_PENDING });
    axios.get(`${fqon}/environments/${environmentId}/providers${type}`).then((response) => {
      dispatch({ type: FETCH_PROVIDERS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_PROVIDERS_REJECTED, payload: err });
    });
  };
}

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete APIs',
        multipleItems,
        onProceed: action,
      }
    });
  };
}
