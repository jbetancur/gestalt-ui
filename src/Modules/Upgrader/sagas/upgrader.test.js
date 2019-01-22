import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import upgraderSagas, {
  fetchUpgradeAvailable,
} from './upgrader';
import {
  FETCH_UPGRADEAVAILABLE_REQUEST,
  FETCH_UPGRADEAVAILABLE_FULFILLED,
  FETCH_UPGRADEAVAILABLE_REJECTED,
} from '../constants';

describe('Upgrder Sagas', () => {
  const error = 'an error has occured';

  describe('fetchUpgradeAvailable Sequenced', () => {
    const saga = fetchUpgradeAvailable();
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'upgradeavailable')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: {} });
      expect(result.value).toEqual(
        put({
          type: FETCH_UPGRADEAVAILABLE_FULFILLED,
          payload: {}
        })
      );
    });
  });

  describe('fetchUpgradeAvailable Sequence when there is an error', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchUpgradeAvailable();
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_UPGRADEAVAILABLE_REJECTED, payload: error })
      );
    });
  });

  describe('upgraderSagas', () => {
    let result;
    const rootSaga = upgraderSagas();

    it('should fork a watcher for fetchUpgradeAvailable', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(FETCH_UPGRADEAVAILABLE_REQUEST, fetchUpgradeAvailable)
      );
    });
  });
});
