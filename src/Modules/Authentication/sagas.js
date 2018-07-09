import { takeLatest, put, call, fork, all } from 'redux-saga/effects';
import axios from 'axios';
import { isIP } from 'validator';
import { removeItem } from 'util/helpers/localstorage';
import Cookies from 'universal-cookie';
import ReactGA from 'react-ga';
import {
  AUTH_TOKEN_REQUEST,
  AUTH_TOKEN_FULFILLED,
  AUTH_TOKEN_REJECTED,
  LOGOUT_REQUEST,
  LOGOUT_FULFILLED,
  LOGOUT_REJECTED,
} from './actionTypes';
import {
  SEC_API_URL,
  API_TIMEOUT,
  UI_VERSION,
  ANALYTICS_TRACKING,
  ANALYTICS_TRACKING_ACCT,
  REQUIRE_HTTPS_COOKIE,
} from '../../constants';

const cookies = new Cookies();

const configureCookie = (cookieOptions) => {
  const cookieConfig = Object.assign({ path: '/' }, cookieOptions);

  // Allow sub domains
  const { hostname } = window.location;
  if (hostname !== 'localhost' && !isIP(hostname)) {
    Object.assign(cookieConfig, { domain: `.${hostname}` });
  }

  return cookieConfig;
};

export const setToken = (token) => {
  const currentDate = new Date(Date.now());
  const expirationDate = new Date();

  expirationDate.setTime(currentDate.getTime() + (token.expires_in * 1000));
  cookies.set('auth_token', token.access_token, configureCookie({
    expires: expirationDate,
    secure: REQUIRE_HTTPS_COOKIE || false
  }));
};

const setAnalytics = (username) => {
  if (ANALYTICS_TRACKING) {
    ReactGA.initialize(ANALYTICS_TRACKING_ACCT, {
      debug: false,
      gaOptions: {
        auto: true,
        clientId: username,
      },
    });

    ReactGA.event({
      category: `UI-LOGIN v${UI_VERSION}`,
      label: `UI-LOGIN v${UI_VERSION}`,
      action: `User Logged into Ui v${UI_VERSION}`,
    });
  }
};

export function* login(action) {
  try {
    const encodedUserName = encodeURIComponent(action.username);
    const encodedPassword = encodeURIComponent(action.password);
    const payload = `grant_type=password&username=${encodedUserName}&password=${encodedPassword}`;
    const securityAPI = axios.create({
      baseURL: SEC_API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }
    });

    const { data } = yield call(securityAPI.post, 'root/oauth/issue', payload);
    yield all([
      yield call(setToken, data),
      yield call(axios.post, 'sync'),
      yield put({ type: AUTH_TOKEN_FULFILLED, payload: data }),
      yield call(setAnalytics, action.username),
    ]);

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: AUTH_TOKEN_REJECTED, payload: e });
  }
}

/**
 * logout
 * @param {*} action (onSuccess)
 */
export function* logout(action) {
  try {
    const tokenId = cookies.get('auth_token');

    if (tokenId) {
      const securityAPI = axios.create({
        baseURL: SEC_API_URL,
        timeout: API_TIMEOUT,
        headers: {
          Authorization: `Bearer ${tokenId}`
        }
      });

      // Trying to be a responsible citizen, othwerwise, we don't care when token delete happens or is successful
      yield call(securityAPI.delete, `accessTokens/${tokenId}`);
    }

    yield put({ type: LOGOUT_FULFILLED });
    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: LOGOUT_REJECTED, payload: e.message });
  } finally {
    cookies.remove('auth_token', configureCookie());
    // Negate the force redirect to / on logout and use the last route instead
    if (!action.preserveLastVisitedRoute) {
      removeItem('lastVisitedRoute');
    }
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, AUTH_TOKEN_REQUEST, login);
  yield fork(takeLatest, LOGOUT_REQUEST, logout);
}
