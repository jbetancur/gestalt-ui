import {
  AUTH_TOKEN_REQUEST,
  LOGOUT_REQUEST,
} from './actionTypes';

/**
 * login
 * @param {String} username
 * @param {String} password
 * @param {Function} onSuccess
 */
export function login(username, password, onSuccess) {
  return { type: AUTH_TOKEN_REQUEST, username, password, onSuccess };
}

/**
 * logout
 * @param {Boolean} preserveLastVisitedRoute
 */
export function logout(preserveLastVisitedRoute) {
  return { type: LOGOUT_REQUEST, preserveLastVisitedRoute };
}

export default {
  login,
  logout,
};
