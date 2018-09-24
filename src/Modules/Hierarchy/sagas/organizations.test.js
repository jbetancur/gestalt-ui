import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import orgSagas, {
  fetchAllOrgs,
  fetchAllOrgsDropDown,
} from './organizations';

import {
  FETCH_ALLORGS_REQUEST,
  FETCH_ALLORGS_FULFILLED,
  FETCH_ALLORGS_REJECTED,
  FETCH_ALLORGSDROPDOWN_REQUEST,
  FETCH_ALLORGSDROPDOWN_FULFILLED,
  FETCH_ALLORGSDROPDOWN_REJECTED,
} from '../constants';

describe('Organization Sagas', () => {
  const error = 'an error has occured';

  describe('fetchAllOrgs Sequence', () => {
    const saga = fetchAllOrgs();
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'orgs?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).toEqual(
        put({ type: FETCH_ALLORGS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAllOrgs();
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_ALLORGS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchAllOrgsDropDown Sequence', () => {
    const saga = fetchAllOrgsDropDown('iamfqon');
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.all, [axios.get('iamfqon'), axios.get('iamfqon/orgs?expand=true')])
      );
    });

    it('should return a payload and dispatch a success status', () => {
      const promiseArray = [
        { data: { id: 1, name: 'whatevs', properties: { fqon: 'fqonling' } } },
        { data: [{ id: 2, name: 'rick', properties: { fqon: 'morty' } }] }
      ];
      const expectedPayload = [
        {
          name: 'whatevs',
          value: 'fqonling',
        },
        {
          name: 'rick',
          value: 'morty',
        },
      ];

      result = saga.next(promiseArray);
      expect(result.value).toEqual(
        put({ type: FETCH_ALLORGSDROPDOWN_FULFILLED, payload: expectedPayload })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAllOrgsDropDown('iamfqon');
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_ALLORGSDROPDOWN_REJECTED, payload: error })
      );
    });
  });

  describe('orgSagas', () => {
    let result;
    const rootSaga = orgSagas();

    it('should fork a watcher for fetchAllOrgs', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, FETCH_ALLORGS_REQUEST, fetchAllOrgs)
      );
    });

    it('should fork a watcher for fetchAllOrgsDropDown', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, FETCH_ALLORGSDROPDOWN_REQUEST, fetchAllOrgsDropDown)
      );
    });
  });
});
