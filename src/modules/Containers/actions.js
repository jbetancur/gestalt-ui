import axios from 'axios';
import { goBack } from 'react-router-redux';
import {
  FETCH_CONTAINERS_PENDING,
  FETCH_CONTAINERS_REJECTED,
  FETCH_CONTAINERS_FULFILLED,
  FETCH_CONTAINER_PENDING,
  FETCH_CONTAINER_REJECTED,
  FETCH_CONTAINER_FULFILLED,
  CREATE_CONTAINER_PENDING,
  CREATE_CONTAINER_FULFILLED,
  CREATE_CONTAINER_REJECTED,
  UPDATE_CONTAINER_PENDING,
  UPDATE_CONTAINER_FULFILLED,
  UPDATE_CONTAINER_REJECTED,
  DELETE_CONTAINER_PENDING,
  DELETE_CONTAINER_FULFILLED,
  DELETE_CONTAINER_REJECTED,
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  CONTAINER_UNLOADED,
  CONTAINERS_UNLOADED,
  SCALE_CONTAINER_PENDING,
  SCALE_CONTAINER_FULFILLED,
  SCALE_CONTAINER_REJECTED,
  MIGRATE_CONTAINER_PENDING,
  MIGRATE_CONTAINER_FULFILLED,
  MIGRATE_CONTAINER_REJECTED,
  FETCH_ENV_PENDING,
  FETCH_ENV_FULFILLED,
  FETCH_ENV_REJECTED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: CONTAINER_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: CONTAINERS_UNLOADED });
  };
}

export function fetchContainers(fqon, environmentId, isPolling) {
  const url = environmentId ? `/${fqon}/environments/${environmentId}/containers` : `/${fqon}/containers`;

  return (dispatch) => {
    if (!isPolling) {
      dispatch({ type: FETCH_CONTAINERS_PENDING });
    }
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_CONTAINERS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_CONTAINERS_REJECTED, payload: err });
    });
  };
}

export function fetchEnv(fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: FETCH_ENV_PENDING });
    axios.get(`${fqon}/environments/${environmentId}/env`).then((response) => {
      dispatch({ type: FETCH_ENV_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_ENV_REJECTED, payload: err });
    });
  };
}

export function fetchContainer(fqon, containerId, environmentId, isPolling) {
  return (dispatch) => {
    if (!isPolling) {
      dispatch({ type: FETCH_CONTAINER_PENDING });
    }

    function getContainer() {
      return axios.get(`${fqon}/containers/${containerId}`);
    }

    function getEnv() {
      return axios.get(`${fqon}/environments/${environmentId}/env`);
    }

    axios.all([getContainer(), getEnv()]).then(axios.spread((container, env) => {
      const payload = { ...container.data };

      payload.properties.env = Object.assign(payload.properties.env, env.data);
      dispatch({ type: FETCH_CONTAINER_FULFILLED, payload });
    })).catch((err) => {
      dispatch({ type: FETCH_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function createContainer(fqon, workspaceId, environmentId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_CONTAINER_PENDING });
    axios.post(`${fqon}/environments/${environmentId}/containers`, payload).then((response) => {
      dispatch({ type: CREATE_CONTAINER_FULFILLED, payload: response.data });
      dispatch(goBack());
    }).catch((err) => {
      dispatch({ type: CREATE_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function redeployContainer(fqon, workspaceId, environmentId, containerId, payload) {
  return (dispatch) => {
    dispatch({ type: UPDATE_CONTAINER_PENDING });
    axios.pur(`${fqon}/containers/${containerId}`, payload).then((response) => {
      dispatch({ type: UPDATE_CONTAINER_FULFILLED, payload: response.data });
      dispatch(goBack());
    }).catch((err) => {
      dispatch({ type: UPDATE_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function deleteContainer(fqon, environmentId, containerId, inContainerView) {
  return (dispatch) => {
    dispatch({ type: DELETE_CONTAINER_PENDING });
    axios.delete(`${fqon}/containers/${containerId}?force=true`).then(() => {
      dispatch({ type: DELETE_CONTAINER_FULFILLED });
      if (inContainerView) {
        dispatch(goBack());
      } else {
        dispatch(fetchContainers(fqon, environmentId));
      }
    }).catch((err) => {
      dispatch({ type: DELETE_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function scaleContainer(fqon, environmentId, containerId, numInstances, inContainerView) {
  return (dispatch) => {
    dispatch({ type: SCALE_CONTAINER_PENDING });
    axios.post(`${fqon}/environments/${environmentId}/containers/${containerId}/scale?numInstances=${numInstances}`).then(() => {
      dispatch({ type: SCALE_CONTAINER_FULFILLED });
      if (inContainerView) {
        fetchContainer(fqon, containerId);
      } else {
        dispatch(fetchContainers(fqon, environmentId));
      }
    }).catch((err) => {
      dispatch({ type: SCALE_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function migrateContainer(fqon, environmentId, containerId, providerId, inContainerView) {
  return (dispatch) => {
    dispatch({ type: MIGRATE_CONTAINER_PENDING });
    axios.post(`${fqon}/environments/${environmentId}/containers/${containerId}/migrate?provider=${providerId}`).then(() => {
      dispatch({ type: MIGRATE_CONTAINER_FULFILLED });
      if (inContainerView) {
        fetchContainer(fqon, containerId);
      } else {
        dispatch(fetchContainers(fqon, environmentId));
      }
    }).catch((err) => {
      dispatch({ type: MIGRATE_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function fetchProviders(fqon, environmentId, providerType) {
  const type = providerType ? `&type=${providerType}` : '';

  return (dispatch) => {
    dispatch({ type: FETCH_PROVIDERS_PENDING, payload: [{ id: '', name: 'fetching providers...' }] });
    axios.get(`${fqon}/environments/${environmentId}/providers?expand=true${type}`).then((response) => {
      if (!response.data.length) {
        dispatch({ type: FETCH_PROVIDERS_FULFILLED, payload: [{ id: '', name: 'No Available Providers' }] });
      } else {
        dispatch({ type: FETCH_PROVIDERS_FULFILLED, payload: response.data });
      }
    }).catch((err) => {
      dispatch({ type: FETCH_PROVIDERS_REJECTED, payload: err });
    });
  };
}

export function confirmDelete(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Are you sure you want to destroy ${item}?`,
        onProceed: action,
        proceedLabel: 'Destroy',
      }
    });
  };
}

export function scaleContainerModal(action, item, numInstances) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_CONTAINER_MODAL',
      modalType: 'SCALE',
      modalProps: {
        title: item,
        numInstances,
        onProceed: action,
      }
    });
  };
}

export function migrateContainerModal(action, item, provider, fetchProvidersCb, params) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_CONTAINER_MODAL',
      modalType: 'MIGRATE',
      modalProps: {
        title: item,
        provider,
        fetchProviders: fetchProvidersCb,
        params,
        onProceed: action,
      }
    });
  };
}

