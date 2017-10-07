import axios from 'axios';
import {
  FETCH_INTEGRATIONS_PENDING,
  FETCH_INTEGRATIONS_REJECTED,
  FETCH_INTEGRATIONS_FULFILLED
} from './actionTypes';

export function fetchIntegrations(fqon, environmentId) {
  const url = environmentId ? `/${fqon}/environments/${environmentId}/integrations` : `/${fqon}/integrations`;

  return (dispatch) => {
    dispatch({ type: FETCH_INTEGRATIONS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_INTEGRATIONS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_INTEGRATIONS_REJECTED, payload: err });
    });
  };
}

export default {
  fetchIntegrations,
};
