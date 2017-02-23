import axios from 'axios';
import cookie from 'react-cookie';
import { replace } from 'react-router-redux';
import {
  FETCH_SELF_PENDING,
  FETCH_SELF_REJECTED,
  FETCH_SELF_FULFILLED,
  FETCH_ORG_CONTEXT_PENDING,
  FETCH_ORG_CONTEXT_FULFILLED,
  FETCH_ORG_CONTEXT_REJECTED,
  FETCH_WORKSPACE_CONTEXT_PENDING,
  FETCH_WORKSPACE_CONTEXT_FULFILLED,
  FETCH_WORKSPACE_CONTEXT_REJECTED,
  FETCH_ENVIRONMENT_CONTEXT_PENDING,
  FETCH_ENVIRONMENT_CONTEXT_FULFILLED,
  FETCH_ENVIRONMENT_CONTEXT_REJECTED,
  CURRENT_ENVIRONMENT_CONTEXT,
  CURRENT_WORKSPACE_CONTEXT,
  CURRENT_ORG_CONTEXT,
  UNLOAD_CURRENT_WORKSPACE_CONTEXT,
  UNLOAD_CURRENT_ENVIRONMENT_CONTEXT,
  LOG_OUT,
} from './actionTypes';
import { SEC_API_URL, API_TIMEOUT } from '../constants';

export function setCurrentOrgContext(organization) {
  return { type: CURRENT_ORG_CONTEXT, payload: organization };
}

export function setCurrentWorkspaceContext(workspace) {
  return { type: CURRENT_WORKSPACE_CONTEXT, payload: workspace };
}

export function unloadWorkspaceContext() {
  return { type: UNLOAD_CURRENT_WORKSPACE_CONTEXT };
}

export function setCurrentEnvironmentContext(workspace) {
  return { type: CURRENT_ENVIRONMENT_CONTEXT, payload: workspace };
}

export function unloadEnvironmentContext() {
  return { type: UNLOAD_CURRENT_ENVIRONMENT_CONTEXT };
}

export function setCurrentOrgContextfromState(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_ORG_CONTEXT_PENDING });
    axios.get(fqon).then((response) => {
      dispatch({ type: FETCH_ORG_CONTEXT_FULFILLED, payload: response.data });
      dispatch(setCurrentOrgContext(response.data));
    }).catch((err) => {
      dispatch({ type: FETCH_ORG_CONTEXT_REJECTED, payload: err });
    });
  };
}

export function setCurrentWorkspaceContextfromState(fqon, workspaceId) {
  return (dispatch) => {
    dispatch({ type: FETCH_WORKSPACE_CONTEXT_PENDING });
    axios.get(`${fqon}/workspaces/${workspaceId}`).then((response) => {
      dispatch({ type: FETCH_WORKSPACE_CONTEXT_FULFILLED, payload: response.data });
      dispatch(setCurrentWorkspaceContext(response.data));
    }).catch((err) => {
      dispatch({ type: FETCH_WORKSPACE_CONTEXT_REJECTED, payload: err });
    });
  };
}

export function setCurrentEnvironmentContextfromState(fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: FETCH_ENVIRONMENT_CONTEXT_PENDING });
    axios.get(`${fqon}/environments/${environmentId}`).then((response) => {
      dispatch({ type: FETCH_ENVIRONMENT_CONTEXT_FULFILLED, payload: response.data });
      dispatch(setCurrentEnvironmentContext(response.data));
    }).catch((err) => {
      dispatch({ type: FETCH_ENVIRONMENT_CONTEXT_REJECTED, payload: err });
    });
  };
}

export function fetchSelf() {
  return (dispatch) => {
    dispatch({ type: FETCH_SELF_PENDING });
    axios.get('users/self').then((selfResponse) => {
      axios.get(selfResponse.data.properties.gestalt_home).then((orgResponse) => {
        const payload = { ...orgResponse.data };

        payload.properties.gestalt_home = orgResponse.data;
        dispatch({ type: FETCH_SELF_FULFILLED, payload });
      });
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

export default {
  setCurrentOrgContext,
  setCurrentWorkspaceContext,
  setCurrentEnvironmentContext,
  unloadWorkspaceContext,
  unloadEnvironmentContext
};
