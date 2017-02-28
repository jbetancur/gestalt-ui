import axios from 'axios';
import { goBack } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_APIENDPOINTS_PENDING,
  FETCH_APIENDPOINTS_REJECTED,
  FETCH_APIENDPOINTS_FULFILLED,
  APIENDPOINT_UNLOADED,
  APIENDPOINTS_UNLOADED,
  SELECTED_APIENDPOINTS,
  FETCH_APIENDPOINT_PENDING,
  FETCH_APIENDPOINT_FULFILLED,
  FETCH_APIENDPOINT_REJECTED,
  CREATE_APIENDPOINT_PENDING,
  CREATE_APIENDPOINT_FULFILLED,
  CREATE_APIENDPOINT_REJECTED,
  UPDATE_APIENDPOINT_PENDING,
  UPDATE_APIENDPOINT_FULFILLED,
  UPDATE_APIENDPOINT_REJECTED,
  DELETE_APIENDPOINT_PENDING,
  DELETE_APIENDPOINT_FULFILLED,
  DELETE_APIENDPOINT_REJECTED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: APIENDPOINT_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: APIENDPOINTS_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_APIENDPOINTS, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_APIENDPOINTS, payload };
}

export function fetchAPIEndpoints(fqon, apiId) {
  return (dispatch) => {
    dispatch({ type: FETCH_APIENDPOINTS_PENDING });
    axios.get(`/${fqon}/apis/${apiId}/apiendpoints?expand=true`).then((response) => {
      dispatch({ type: FETCH_APIENDPOINTS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_APIENDPOINTS_REJECTED, payload: err });
    });
  };
}

export function fetchAPIEndpoint(fqon, apiId, apiendpointId) {
  return (dispatch) => {
    dispatch({ type: FETCH_APIENDPOINT_PENDING });
    axios.get(`${fqon}/apis/${apiId}/apiendpoints/${apiendpointId}`).then((response) => {
      dispatch({ type: FETCH_APIENDPOINT_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_APIENDPOINT_REJECTED, payload: err });
    });
  };
}

export function createAPIEndpoint(fqon, apiId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_APIENDPOINT_PENDING });
    axios.post(`${fqon}/apis/${apiId}/apiendpoints`, payload).then((response) => {
      dispatch({ type: CREATE_APIENDPOINT_FULFILLED, payload: response.data });
      dispatch(goBack());
    }).catch((err) => {
      dispatch({ type: CREATE_APIENDPOINT_REJECTED, payload: err });
    });
  };
}

export function updateAPIEndpoint(fqon, apiId, apiendpointId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_APIENDPOINT_PENDING });
    axios.patch(`${fqon}/apis/${apiId}/apiendpoints/${apiendpointId}`, patches).then((response) => {
      dispatch({ type: UPDATE_APIENDPOINT_FULFILLED, payload: response.data });
      dispatch(goBack());
    }).catch((err) => {
      dispatch({ type: UPDATE_APIENDPOINT_REJECTED, payload: err });
    });
  };
}

export function deleteAPIEndpoint(fqon, apiId, apiendpointId) {
  return (dispatch) => {
    dispatch({ type: DELETE_APIENDPOINT_PENDING });
    axios.delete(`${fqon}/apis/${apiId}/apiendpoints/${apiendpointId}?force=true`).then(() => {
      dispatch({ type: DELETE_APIENDPOINT_FULFILLED });
    }).catch((err) => {
      dispatch({ type: DELETE_APIENDPOINT_REJECTED, payload: err });
    });
  };
}

export function deleteAPIEndpoints(apiendpointIds, fqon, apiId) {
  return (dispatch) => {
    dispatch({ type: DELETE_APIENDPOINT_PENDING });
    const all = apiendpointIds.map(id => axios.delete(`${fqon}/apis/${apiId}/apiendpoints/${id}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_APIENDPOINT_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchAPIEndpoints(fqon, apiId));
    }).catch((err) => {
      dispatch({ type: DELETE_APIENDPOINT_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete API Endpoints',
        multipleItems,
        onProceed: action,
      }
    });
  };
}
