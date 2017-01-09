import axios from 'axios';
import {
  FETCH_CONTAINERS_PENDING,
  FETCH_CONTAINERS_REJECTED,
  FETCH_CONTAINERS_FULFILLED
} from './actionTypes';

export function fetchContainers(fqon, environmentId) {
  const url = environmentId ? `/${fqon}/environments/${environmentId}/containers` : `/${fqon}/containers`;

  return (dispatch) => {
    dispatch({ type: FETCH_CONTAINERS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_CONTAINERS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_CONTAINERS_REJECTED, payload: err });
    });
  };
}

export { fetchContainers as default };
