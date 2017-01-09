import axios from 'axios';
import { push, replace } from 'react-router-redux';
import {
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_REJECTED,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDER_PENDING,
  FETCH_PROVIDER_FULFILLED,
  FETCH_PROVIDER_REJECTED,
  CREATE_PROVIDER_PENDING,
  CREATE_PROVIDER_FULFILLED,
  CREATE_PROVIDER_REJECTED,
  UPDATE_PROVIDER_PENDING,
  UPDATE_PROVIDER_FULFILLED,
  UPDATE_PROVIDER_REJECTED,
  DELETE_PROVIDER_PENDING,
  DELETE_PROVIDER_REJECTED
} from './actionTypes';

export function fetchProviders(fqon, entityId, entityKey) {
  const url = entityId ? `${fqon}/${entityKey}/${entityId}/providers` : `${fqon}/providers`;

  return (dispatch) => {
    dispatch({ type: FETCH_PROVIDERS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_PROVIDERS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_PROVIDERS_REJECTED, payload: err });
    });
  };
}

export function fetchProvider(fqon, providerId) {
  return (dispatch) => {
    dispatch({ type: FETCH_PROVIDER_PENDING });
    axios.get(`${fqon}/providers/${providerId}`).then((response) => {
      dispatch({ type: FETCH_PROVIDER_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function createProvider(fqon, entityId, entityKey, payload, routeToUrl) {
  const url = entityId ? `${fqon}/${entityKey}/${entityId}/providers` : `${fqon}/providers`;

  return (dispatch) => {
    dispatch({ type: CREATE_PROVIDER_PENDING });
    axios.post(url, payload).then((response) => {
      dispatch({ type: CREATE_PROVIDER_FULFILLED, payload: response.data });
      dispatch(push(routeToUrl));
    }).catch((err) => {
      dispatch({ type: CREATE_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function updateProvider(fqon, providerId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_PROVIDER_PENDING });
    axios.patch(`${fqon}/providers/${providerId}`, patches).then((response) => {
      dispatch({ type: UPDATE_PROVIDER_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/providers`));
    }).catch((err) => {
      dispatch({ type: UPDATE_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function deleteProvider(fqon, providerId) {
  return (dispatch) => {
    dispatch({ type: DELETE_PROVIDER_PENDING });
    axios.delete(`${fqon}/providers/${providerId}?force=true`).then(() => {
      dispatch(replace(`${fqon}/providers`));
    }).catch((err) => {
      dispatch({ type: DELETE_PROVIDER_REJECTED, payload: err });
    });
  };
}

export default { fetchProviders, fetchProvider, createProvider, updateProvider, deleteProvider };
