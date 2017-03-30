import axios from 'axios';
import { toggleHandler } from 'util/helpers/lists';
import constants from './constants';
import {
  SELECTED_PROVIDERS,
  FETCH_CONTAINER_PENDING,
  FETCH_CONTAINER_FULFILLED,
  FETCH_CONTAINER_REJECTED,
} from './actionTypes';

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

export function fetchEnvSchema(type) {
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

export function fetchContainer(fqon, providerId) {
  return (dispatch) => {
    dispatch({ type: FETCH_CONTAINER_PENDING });
    axios.get(`${fqon}/providers/${providerId}/containers`).then((response) => {
      if (response.data.length) {
        // TODO: Eventually will be an array of containers
        axios.get(`${fqon}/providers/${providerId}/containers/${response.data[0].id}`).then((responseContainer) => {
          dispatch({ type: FETCH_CONTAINER_FULFILLED, payload: responseContainer.data });
        });
      } else {
        dispatch({ type: FETCH_CONTAINER_FULFILLED });
      }
    }).catch((err) => {
      dispatch({ type: FETCH_CONTAINER_REJECTED, payload: err });
    });
  };
}

export function confirmUpdate(action, item) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: `Updating "${item}" provider will require a restart. Are you sure you want to proceed?`,
        onProceed: action,
        proceedLabel: 'Update',
      }
    });
  };
}

