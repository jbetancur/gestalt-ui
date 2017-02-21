import axios from 'axios';
import cookie from 'react-cookie';
import { replace } from 'react-router-redux';
import {
  FETCH_SELF_PENDING,
  FETCH_SELF_REJECTED,
  FETCH_SELF_FULFILLED,
  FETCH_ORG_PENDING,
  FETCH_ORG_REJECTED,
  FETCH_ORG_FULFILLED,
  CURRENT_ORG_CONTEXT,
  LOG_OUT,
} from './actionTypes';
import { SEC_API_URL, API_TIMEOUT } from '../constants';

export function setCurrentOrgContext(organization) {
  return { type: CURRENT_ORG_CONTEXT, payload: organization };
}

export function fetchBaseOrganization(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_ORG_PENDING });
    axios.get(fqon).then((response) => {
      dispatch({ type: FETCH_ORG_FULFILLED, payload: response.data });
      dispatch(setCurrentOrgContext(response.data));
    }).catch((err) => {
      dispatch({ type: FETCH_ORG_REJECTED, payload: err });
    });
  };
}

export function fetchSelf() {
  return (dispatch) => {
    dispatch({ type: FETCH_SELF_PENDING });
    axios.get('users/self').then((response) => {
      dispatch({ type: FETCH_SELF_FULFILLED, payload: response.data });
      dispatch(fetchBaseOrganization(response.data.properties.gestalt_home));
    }).catch((err) => {
      dispatch({ type: FETCH_SELF_REJECTED, payload: err });
    });
  };
}

export function logout() {
  return (dispatch) => {
    const tokenId = cookie.load('auth-token');
    const securityAPI = axios.create({
      baseURL: SEC_API_URL,
      timeout: API_TIMEOUT,
      headers: {
        Authorization: `Bearer ${tokenId}`
      }
    });

    // delete local cookie and redirect whether api token delete succeeds or not
    cookie.remove('auth-token', { path: '/' });
    dispatch(replace('login'));

    securityAPI.delete(`accessTokens/${tokenId}`).then(() => {
      dispatch({ type: LOG_OUT });
    });
  };
}

export default { setCurrentOrgContext };
