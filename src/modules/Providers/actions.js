import axios from 'axios';
import { replace, push } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import providerTypes from './lists/providerTypes';

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
  DELETE_PROVIDER_FULFILLED,
  DELETE_PROVIDER_REJECTED,
  SELECTED_PROVIDERS,
  SELECTED_PROVIDER_TYPE,
  PROVIDER_UNLOADED,
  PROVIDERS_UNLOADED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: PROVIDER_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: PROVIDERS_UNLOADED });
  };
}

export function handleProviderType(value) {
  const payload = providerTypes[providerTypes.findIndex(item => item.value === value)].type;
  return (dispatch) => {
    dispatch({ type: SELECTED_PROVIDER_TYPE, payload });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_PROVIDERS, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_PROVIDERS, payload };
}

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
      dispatch(replace(routeToUrl));
    }).catch((err) => {
      dispatch({ type: CREATE_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function updateProvider(fqon, providerId, patches, routeToUrl) {
  return (dispatch) => {
    dispatch({ type: UPDATE_PROVIDER_PENDING });
    axios.patch(`${fqon}/providers/${providerId}`, patches).then((response) => {
      dispatch({ type: UPDATE_PROVIDER_FULFILLED, payload: response.data });
      dispatch(push(routeToUrl));
    }).catch((err) => {
      dispatch({ type: UPDATE_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function deleteProvider(fqon, providerId) {
  return (dispatch) => {
    dispatch({ type: DELETE_PROVIDER_PENDING });
    axios.delete(`${fqon}/providers/${providerId}?force=true`).then(() => {
      dispatch({ type: DELETE_PROVIDER_FULFILLED });
    }).catch((err) => {
      dispatch({ type: DELETE_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function deleteProviders(providerIds, fqon, entityId, entityKey) {
  return (dispatch) => {
    dispatch({ type: DELETE_PROVIDER_PENDING });
    const all = providerIds.map(item => axios.delete(`${fqon}/providers/${item}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_PROVIDER_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchProviders(fqon, entityId, entityKey));
    }).catch((err) => {
      dispatch({ type: DELETE_PROVIDER_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}
