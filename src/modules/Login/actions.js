import axios from 'axios';
import cookie from 'react-cookie';
import { push } from 'react-router-redux';
import {
  REQUEST_TOKEN_PENDING,
  REQUEST_TOKEN_FULFILLED,
  REQUEST_TOKEN_REJECTED
} from './actionTypes';

const securityAPI = axios.create({
  baseURL: 'http://localhost:8300',
  // 'content-type': 'application/x-www-form-urlencoded',
  // accept: 'application/json'
});

export function requestAuthToken(username, password) {
  function setToken(token) {
    const currentDate = new Date(Date.now());
    const expirationDate = new Date();

    expirationDate.setTime(currentDate.getTime() + (token.expires_in * 1000));
    cookie.save('auth-token', token.access_token, { expires: expirationDate, path: '/' });
  }

  return (dispatch) => {
    dispatch({ type: REQUEST_TOKEN_PENDING });

    // const encodedUserName = encodeURIComponent(username);
    // const encodedPassword = encodeURIComponent(password);
    // const payload = `grant_type=password&username=${encodedUserName}&password=${encodedPassword}`;

    const payload = {
      username,
      password
    };

    securityAPI.post('token', payload).then((response) => {
      dispatch({ type: REQUEST_TOKEN_FULFILLED, payload: response.data });
      setToken(response.data);
      dispatch(push('/'));
    }).catch((err) => {
      dispatch({ type: REQUEST_TOKEN_REJECTED, payload: err });
    });
  };
}

export default { requestAuthToken };
