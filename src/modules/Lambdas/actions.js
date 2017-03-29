import axios from 'axios';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  SELECTED_LAMBDAS,
  FETCH_ENV_REQUEST,
  FETCH_ENV_FULFILLED,
  FETCH_ENV_REJECTED,
  FETCH_EXECUTORS_REQUEST,
  FETCH_EXECUTORS_FULFILLED,
  FETCH_EXECUTORS_REJECTED,
  CHANGE_EDITOR_THEME,
} from './actionTypes';

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

export function fetchEnv(fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: FETCH_ENV_REQUEST });
    axios.get(`${fqon}/environments/${environmentId}/env`).then((response) => {
      dispatch({ type: FETCH_ENV_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_ENV_REJECTED, payload: err });
    });
  };
}

export function fetchProviders(fqon, environmentId, providerType) {
  const type = providerType ? `&type=${providerType}` : '';

  return (dispatch) => {
    dispatch({ type: FETCH_PROVIDERS_REQUEST, payload: [{ id: '', name: 'fetching providers...' }] });
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

export function fetchExecutors(fqon, environmentId, executorType) {
  return (dispatch) => {
    dispatch({ type: FETCH_EXECUTORS_REQUEST, payload: [{ runtime: '', name: 'fetching executors...' }] });
    axios.get(`${fqon}/environments/${environmentId}/providers?expand=true&type=${executorType}`).then((response) => {
      if (!response.data.length) {
        dispatch({ type: FETCH_EXECUTORS_FULFILLED, payload: [{ runtime: '', name: 'No Available Executors' }] });
      } else {
        const payload = response.data.map(executor => ({ name: `${executor.name} (${executor.resource_type.split(/[::]+/).pop()})`, runtime: executor.properties.config.env.public.RUNTIME }));
        dispatch({ type: FETCH_EXECUTORS_FULFILLED, payload });
      }
    }).catch((err) => {
      dispatch({ type: FETCH_EXECUTORS_REJECTED, payload: err });
    });
  };
}

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Lambdas',
        multipleItems,
        onProceed: action,
      }
    });
  };
}

export function handleTheme(theme) {
  localStorage.setItem('gf-editor-theme', theme);
  return { type: CHANGE_EDITOR_THEME, theme };
}
