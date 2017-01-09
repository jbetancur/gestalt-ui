import axios from 'axios';
import {
  FETCH_GROUPS_PENDING,
  FETCH_GROUPS_REJECTED,
  FETCH_GROUPS_FULFILLED
} from './actionTypes';

export function fetchGroups(fqon) {
  const url = `/${fqon}/groups`;

  return (dispatch) => {
    dispatch({ type: FETCH_GROUPS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_GROUPS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_GROUPS_REJECTED, payload: err });
    });
  };
}

export { fetchGroups as default };
