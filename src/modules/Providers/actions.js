import axios from 'axios';
import { goBack } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import constants from './constants';
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
  PROVIDER_UNLOADED,
  PROVIDERS_UNLOADED,
} from './actionTypes';

function fixProperties(data) {
  const payload = { ...data };
  // TODO: providers such as kubernetes do not have this field plus the API refuses to populate a standard schema
  // May split out providers types into their own respective modules/forms
  if (payload.properties.config && !payload.properties.config.env) {
    payload.properties.config = { env: { public: {}, private: {} } };
  }

  if (!payload.properties.linked_providers) {
    payload.properties.linked_providers = [];
  }

  return payload;
}

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
      dispatch({ type: FETCH_PROVIDER_FULFILLED, payload: fixProperties(response.data) });
    }).catch((err) => {
      dispatch({ type: FETCH_PROVIDER_REJECTED, payload: err });
    });
  };
}

export function createProvider(fqon, entityId, entityKey, payload) {
  const url = entityId ? `${fqon}/${entityKey}/${entityId}/providers` : `${fqon}/providers`;

  return (dispatch) => {
    dispatch({ type: CREATE_PROVIDER_PENDING });
    axios.post(url, payload).then((response) => {
      dispatch({ type: CREATE_PROVIDER_FULFILLED, payload: response.data });
      dispatch(goBack());
      // dispatch(replace(routeToUrl));
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
      dispatch(goBack());
      // dispatch(push(routeToUrl));
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

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Providers',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export function fetchSchema(type) {
  return (dispatch) => {
    dispatch({ type: `providers/FETCH_${type}_SCHEMA_PENDING`, schemaType: type });
    axios.get(`/root/resourcetypes/${constants[type]}/schema?filter=config`).then((response) => {
      dispatch({
        type: `providers/FETCH_${type}_SCHEMA_FULFILLED`,
        payload: {
          public: response.data.filter(item => item.public === true),
          private: response.data.filter(item => item.public === false),
        },
        schemaType: type
      });
    }).catch((err) => {
      dispatch({ type: `providers/FETCH_${type}_SCHEMA_REJECTED`, payload: err, schemaType: type });
    });
  };
}

