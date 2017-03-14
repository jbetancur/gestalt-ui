import axios from 'axios';
import cookie from 'react-cookie';
import { replace } from 'react-router-redux';
import {
  REQUEST_TOKEN_PENDING,
  REQUEST_TOKEN_FULFILLED,
  REQUEST_TOKEN_REJECTED,
  LOG_OUT,
} from './actionTypes';
import { SEC_API_URL, API_TIMEOUT } from '../../constants';

export function hideLoginModal() {
  return { type: 'HIDE_LOGIN_MODAL' };
}

export function login(username, password, isModalLogin) {
  const securityAPI = axios.create({
    baseURL: SEC_API_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }
  });

  function setToken(token) {
    const currentDate = new Date(Date.now());
    const expirationDate = new Date();

    expirationDate.setTime(currentDate.getTime() + (token.expires_in * 1000));
    cookie.save('auth-token', token.access_token, { expires: expirationDate, path: '/' });
  }

  return (dispatch) => {
    dispatch({ type: REQUEST_TOKEN_PENDING });

    const encodedUserName = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const payload = `grant_type=password&username=${encodedUserName}&password=${encodedPassword}`;

    securityAPI.post('root/oauth/issue', payload).then((response) => {
      dispatch({ type: REQUEST_TOKEN_FULFILLED, payload: response.data });
      setToken(response.data);

      if (isModalLogin) {
        dispatch(hideLoginModal());
      } else {
        dispatch(replace('/'));
      }
    }).catch((err) => {
      dispatch({ type: REQUEST_TOKEN_REJECTED, payload: err });
    });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOG_OUT });

    const tokenId = cookie.load('auth-token');

    if (tokenId) {
      const securityAPI = axios.create({
        baseURL: SEC_API_URL,
        timeout: API_TIMEOUT,
        headers: {
          Authorization: `Bearer ${tokenId}`
        }
      });

      securityAPI.delete(`accessTokens/${tokenId}`);

      // delete local cookie and redirect whether api token delete succeeds or not
      cookie.remove('auth-token', { path: '/' });
      dispatch(replace('login'));
    }
  };
}

export default {
  login,
  logout,
};
