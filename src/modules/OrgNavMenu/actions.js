import axios from 'axios';
import {
  FETCH_ALLORGS_PENDING,
  FETCH_ALLORGS_FULFILLED,
  FETCH_ALLORGS_REJECTED,
  FILTER_ALLORGS_TEXT,
  UNLOAD_ALLORGS,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: UNLOAD_ALLORGS });
  };
}

export function fetchAllOrgs() {
  return (dispatch) => {
    dispatch({ type: FETCH_ALLORGS_PENDING });
    axios.get('orgs?expand=true').then((response) => {
      dispatch({ type: FETCH_ALLORGS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_ALLORGS_REJECTED, payload: err });
    });
  };
}

export function filterOrgs(predicate) {
  return (dispatch) => {
    dispatch({ type: FILTER_ALLORGS_TEXT, filterText: predicate });
  };
}

export default { fetchAllOrgs, filterOrgs };
