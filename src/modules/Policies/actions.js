import axios from 'axios';
import {
  FETCH_POLICIES_PENDING,
  FETCH_POLICIES_REJECTED,
  FETCH_POLICIES_FULFILLED
} from './actionTypes';

export function fetchPolicies(fqon, environmentId) {
  const url = environmentId ? `/${fqon}/environments/${environmentId}/policies` : `/${fqon}/policies`;

  return (dispatch) => {
    dispatch({ type: FETCH_POLICIES_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_POLICIES_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_POLICIES_REJECTED, payload: err });
    });
  };
}

export { fetchPolicies as default };
