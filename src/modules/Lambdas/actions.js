import axios from 'axios';
import { replace } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_LAMBDAS_PENDING,
  FETCH_LAMBDAS_REJECTED,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDA_PENDING,
  FETCH_LAMBDA_FULFILLED,
  FETCH_LAMBDA_REJECTED,
  CREATE_LAMBDA_PENDING,
  CREATE_LAMBDA_FULFILLED,
  CREATE_LAMBDA_REJECTED,
  UPDATE_LAMBDA_PENDING,
  UPDATE_LAMBDA_FULFILLED,
  UPDATE_LAMBDA_REJECTED,
  DELETE_LAMBDA_PENDING,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  LAMBDA_UNLOADED,
  LAMBDAS_UNLOADED,
  SELECTED_LAMBDAS,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: LAMBDA_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: LAMBDAS_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_LAMBDAS, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_LAMBDAS, payload };
}

export function fetchLambdas(fqon, environmentId) {
  const url = environmentId ? `/${fqon}/environments/${environmentId}/lambdas` : `/${fqon}/lambdas`;

  return (dispatch) => {
    dispatch({ type: FETCH_LAMBDAS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_LAMBDAS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_LAMBDAS_REJECTED, payload: err });
    });
  };
}

export function fetchLambda(fqon, lambdaId) {
  return (dispatch) => {
    dispatch({ type: FETCH_LAMBDA_PENDING });
    axios.get(`${fqon}/lambdas/${lambdaId}`).then((response) => {
      dispatch({ type: FETCH_LAMBDA_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function createLambda(fqon, workspaceId, environmentId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_LAMBDA_PENDING });
    axios.post(`${fqon}/environments/${environmentId}/lambdas`, payload).then((response) => {
      dispatch({ type: CREATE_LAMBDA_FULFILLED, payload: response.data });
      dispatch(replace(`${fqon}/workspaces/${workspaceId}/environments/${environmentId}`));
    }).catch((err) => {
      dispatch({ type: CREATE_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function updateLambda(fqon, workspaceId, environmentId, lambdaId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_LAMBDA_PENDING });
    axios.patch(`${fqon}/lambdas/${lambdaId}`, patches).then((response) => {
      dispatch({ type: UPDATE_LAMBDA_FULFILLED, payload: response.data });
      dispatch(replace(`${fqon}/workspaces/${workspaceId}/environments/${environmentId}`));
    }).catch((err) => {
      dispatch({ type: UPDATE_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function deleteLambda(fqon, lambdaId) {
  return (dispatch) => {
    dispatch({ type: DELETE_LAMBDA_PENDING });
    axios.delete(`${fqon}/lambdas/${lambdaId}?force=true`).then(() => {
    }).catch((err) => {
      dispatch({ type: DELETE_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function deleteLambdas(lambdaIds, fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: DELETE_LAMBDA_PENDING });
    const all = lambdaIds.map(id => axios.delete(`${fqon}/lambdas/${id}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_LAMBDA_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchLambdas(fqon, environmentId));
    }).catch((err) => {
      dispatch({ type: DELETE_LAMBDA_REJECTED, payload: err });
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
