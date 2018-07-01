import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import orgSagas, {
  fetchAllOrgs,
  fetchOrgSet,
  fetchAllOrgsDropDown,
} from './organizations';

import * as types from '../actionTypes';

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
        put({ type: types.FETCH_ALLORGS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAllOrgs();
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_ALLORGS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchOrgSet Sequence', () => {
    const saga = fetchOrgSet({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.all, [axios.get('iamfqon'), axios.get('iamfqon/orgs?expand=true'), axios.get('iamfqon/workspaces?expand=true')])
      );
    });

    it('should return a payload and dispatch a success status', () => {
      const promiseArray = [{ data: { id: 1 } }, { data: [{ id: 1 }] }, { data: [{ id: 3 }] }];
      const expectedPayload = { id: 1, organizations: [{ id: 1 }], workspaces: [{ id: 3 }] };

      result = saga.next(promiseArray);
      expect(result.value).toEqual(
        put({ type: types.FETCH_ORGSET_FULFILLED, payload: expectedPayload })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchOrgSet({ fqon: 'iamfqon' });
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_ORGSET_REJECTED, payload: error })
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
        put({ type: types.FETCH_ALLORGS_DROPDOWN_FULFILLED, payload: expectedPayload })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAllOrgsDropDown('iamfqon');
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_ALLORGS_DROPDOWN_REJECTED, payload: error })
      );
    });
  });

  describe('orgSagas', () => {
    let result;
    const rootSaga = orgSagas();

    it('should fork a watcher for fetchAllOrgs', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ALLORGS_REQUEST, fetchAllOrgs)
      );
    });

    it('should fork a watcher for fetchOrgSet', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ORGSET_REQUEST, fetchOrgSet)
      );
    });

    it('should fork a watcher for fetchAllOrgsDropDown', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ALLORGS_DROPDOWN_REQUEST, fetchAllOrgsDropDown)
      );
    });
  });
});
