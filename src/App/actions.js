import axios from 'axios';
import cookie from 'react-cookie';
import { push } from 'react-router-redux';
import {
  FETCH_SELF_PENDING,
  FETCH_SELF_REJECTED,
  FETCH_SELF_FULFILLED,
  LOG_OUT
} from './actionTypes';

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
    cookie.remove('auth-token', { path: '/' });
    dispatch({ type: LOG_OUT });
    dispatch(push('/login'));
  };
}

export default { fetchSelf, logout };
