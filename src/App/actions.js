import axios from 'axios';
import cookie from 'react-cookie';
import { replace } from 'react-router-redux';
import {
  FETCH_SELF_PENDING,
  FETCH_SELF_REJECTED,
  FETCH_SELF_FULFILLED,
  LOG_OUT
} from './actionTypes';

const securityURL = 'https://security.test.galacticfog.com';

export function fetchSelf() {
  return (dispatch) => {
    dispatch({ type: FETCH_SELF_PENDING });
    axios.get('users/self').then((response) => {
      dispatch({ type: FETCH_SELF_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_SELF_REJECTED, payload: err });
    });
  };
}

export function logout() {
  return (dispatch) => {
    const tokenId = cookie.load('auth-token');
    const securityAPI = axios.create({
      baseURL: securityURL,
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
