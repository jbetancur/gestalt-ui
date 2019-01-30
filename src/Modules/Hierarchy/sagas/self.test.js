import axios from 'axios';
import { call, put, takeLatest, retry } from 'redux-saga/effects';
import { API_RETRIES } from '../../../constants';

import selfSagas, {
  fetchSelf,
  handleSelf,
} from './self';
import {
  FETCH_SELF_REQUEST,
  FETCH_SELF_FULFILLED,
  FETCH_SELF_REJECTED,
} from '../actionTypes';

describe('Self Sagas', () => {
  const error = 'Attempts to reach meta/self failed';

  describe('handleSelf Sequence', () => {
    const saga = handleSelf();
    let result;

    it('should make an api call for the user/self', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'users/self')
      );
    });

    it('should make an api call for the organization', () => {
      result = saga.next({ data: { id: 1, properties: { gestalt_home: 'iamfqon' } } });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon')
      );
    });

    it('should return a payload', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual({ id: 1, properties: { gestalt_home: { id: 1 } } });

      // Finish the iteration
      result = saga.next();
    });
  });

  describe('fetchSelf Sequence', () => {
    const saga = fetchSelf();
    let result;

    it('should call the function handleSelf', () => {
      result = saga.next();
      expect(result.value).toEqual(
        retry(API_RETRIES, 2000, handleSelf)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1, properties: { gestalt_home: { id: 1 } } } });
      expect(result.value).toEqual(
        put({ type: FETCH_SELF_FULFILLED, payload: { data: { id: 1, properties: { gestalt_home: { id: 1 } } } } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchSelf({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_SELF_REJECTED, payload: error })
      );
    });
  });

  describe('selfSagas', () => {
    let result;
    const rootSaga = selfSagas();

    it('should fork a watcher for fetchSelf', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(FETCH_SELF_REQUEST, fetchSelf)
      );
    });
  });
});
