import axios from 'axios';
import cookie from 'react-cookie';
import ReactGA from 'react-ga';
import {
  REQUEST_TOKEN_PENDING,
  REQUEST_TOKEN_FULFILLED,
  REQUEST_TOKEN_REJECTED,
  LOG_OUT,
  LOG_OUT_REJECTED,
} from './actionTypes';
import { SEC_API_URL, API_TIMEOUT, UI_VERSION, ANALYTICS_TRACKING, ANALYTICS_TRACKING_ACCT } from '../../constants';

function setToken(token) {
  const currentDate = new Date(Date.now());
  const expirationDate = new Date();
  expirationDate.setTime(currentDate.getTime() + (token.expires_in * 1000));
  const cookieConfig = { expires: expirationDate, path: '/' };

  // Only set the domain if this token is not a local dev environment
  if (window.location.hostname !== 'localhost') {
    Object.assign(cookieConfig, { domain: `.${window.location.hostname}` });
  }

  cookie.save('auth-token', token.access_token, cookieConfig);
}

export function hideLoginModal() {
  return { type: 'HIDE_LOGIN_MODAL' };
}

export function login(username, password) {
  const securityAPI = axios.create({
    baseURL: SEC_API_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }
  });

  return (dispatch) => {
    dispatch({ type: REQUEST_TOKEN_PENDING });

    const encodedUserName = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const payload = `grant_type=password&username=${encodedUserName}&password=${encodedPassword}`;

    return securityAPI.post('root/oauth/issue', payload).then((response) => {
      dispatch({ type: REQUEST_TOKEN_FULFILLED, payload: response.data });
      setToken(response.data);

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

      return securityAPI.delete(`accessTokens/${tokenId}`);
    }

    // must return something - so purpoesly goes into the ether...
    return dispatch({ type: LOG_OUT_REJECTED });
  };
}

export default {
  hideLoginModal,
  login,
  logout,
};
