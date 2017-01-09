import axios from 'axios';
import { push, replace } from 'react-router-redux';
import {
  FETCH_ORGS_PENDING,
  FETCH_ORGS_REJECTED,
  FETCH_ORGS_FULFILLED,
  FETCH_ORG_PENDING,
  FETCH_ORG_FULFILLED,
  FETCH_ORG_REJECTED,
  FETCH_ORGSET_PENDING,
  FETCH_ORGSET_FULFILLED,
  FETCH_ORGSET_REJECTED,
  CREATE_ORG_PENDING,
  CREATE_ORG_FULFILLED,
  CREATE_ORG_REJECTED,
  DELETE_ORG_PENDING,
  DELETE_ORG_FULFILLED,
  DELETE_ORG_REJECTED,
  UPDATE_ORG_PENDING,
  UPDATE_ORG_FULFILLED,
  UPDATE_ORG_REJECTED
} from './actionTypes';

export function fetchOrgs(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_ORGS_PENDING });
    axios.get(`${fqon}/orgs?expand=true`).then((response) => {
      dispatch({ type: FETCH_ORGS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_ORGS_REJECTED, payload: err });
    });
  };
}

export function fetchOrg(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_ORG_PENDING });
    axios.get(fqon).then((response) => {
      dispatch({ type: FETCH_ORG_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_ORG_REJECTED, payload: err });
    });
  };
}

export function fetchOrgSet(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_ORGSET_PENDING });

    function getOrg() {
      return axios.get(fqon);
    }

    function getSubOrgs() {
      return axios.get(`${fqon}/orgs?expand=true`);
    }

    axios.all([getOrg(), getSubOrgs()]).then(axios.spread((org, subOrgs) => {
      const payload = {
        item: org.data,
        items: subOrgs.data
      };

      dispatch({ type: FETCH_ORGSET_FULFILLED, payload });
    })).catch((err) => {
      dispatch({ type: FETCH_ORGSET_REJECTED, payload: err });
    });
  };
}

export function createOrg(fqon, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_ORG_PENDING });
    axios.post(fqon, payload).then((response) => {
      const { properties } = response.data;

      dispatch({ type: CREATE_ORG_FULFILLED, payload: response.data });
      dispatch(push(`${properties.fqon}/organizations`));
    }).catch((err) => {
      dispatch({ type: CREATE_ORG_REJECTED, payload: err });
    });
  };
}

export function updateOrg(fqon, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_ORG_PENDING });
    axios.patch(fqon, patches).then((response) => {
      const { properties } = response.data;

      dispatch({ type: UPDATE_ORG_FULFILLED, payload: response.data });
      dispatch(push(`${properties.fqon}/organizations`));
    }).catch((err) => {
      dispatch({ type: UPDATE_ORG_REJECTED, payload: err });
    });
  };
}

export function deleteOrg(fqon, parentFQON) {
  return (dispatch) => {
    dispatch({ type: DELETE_ORG_PENDING });
    axios.delete(`${fqon}?force=true`).then(() => {
      dispatch({ type: DELETE_ORG_FULFILLED });
      dispatch(replace(`${parentFQON}/organizations`));
    }).catch((err) => {
      dispatch({ type: DELETE_ORG_REJECTED, payload: err });
    });
  };
}

