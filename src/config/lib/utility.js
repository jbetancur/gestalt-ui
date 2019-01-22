import axios, { CancelToken } from 'axios';
import { call, delay } from 'redux-saga/effects';
import { CANCEL } from 'redux-saga';

/**
 * poll
 * @summary fake a poll when called
 * @param {Function} method
 * @param {Object} action
 */
export function* poll(method, action) {
  while (true) {
    try {
      yield delay(5000);
      yield call(method, { ...action, noPending: true, enablePolling: true });
    } catch (error) {
      // cancellation error -- can handle this if you wish
    }
  }
}

/**
 * fetchAPI
 * @summary Abstracts axios.get with a cancel token
 * @param {String} url
 */
export const fetchAPI = (url) => {
  const source = CancelToken.source();
  const request = axios.get(url, { cancelToken: source.token });
  request[CANCEL] = () => source.cancel();

  return request;
};
