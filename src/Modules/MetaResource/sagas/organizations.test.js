import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import orgSagas, {
  fetchAllOrgs,
  fetchOrgs,
  fetchOrg,
  fetchOrgSet,
  createOrg,
  updateOrg,
  deleteOrg,
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

  describe('fetchOrgs Sequence', () => {
    const saga = fetchOrgs({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/orgs?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).toEqual(
        put({ type: types.FETCH_ORGS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchOrgs({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_ORGS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchOrg Sequence', () => {
    const saga = fetchOrg({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.FETCH_ORG_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchOrg({ fqon: 'iamfqon' });
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_ORG_REJECTED, payload: error })
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
      const expectedPayload = { id: 1, subOrganizations: [{ id: 1 }], workspaces: [{ id: 3 }] };

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

  describe('createOrg Sequence', () => {
    const action = { fqon: 'iamfqon', payload: { name: 'iamnewfqon' } };
    const saga = createOrg(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, action.fqon, action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.CREATE_ORG_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', payload: { name: 'iamnewfqon' }, onSuccess: sinon.stub() };
      const sagaSuccess = createOrg(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createOrg(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.CREATE_ORG_REJECTED, payload: error })
      );
    });
  });

  describe('updateOrg Sequence', () => {
    const action = { fqon: 'iamfqon', payload: [] };
    const saga = updateOrg(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, action.fqon, action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.UPDATE_ORG_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateOrg(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateOrg(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: types.UPDATE_ORG_REJECTED, payload: error })
      );
    });
  });

  describe('deleteOrg Sequence', () => {
    const action = { fqon: 'iamfqon' };
    const saga = deleteOrg(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_ORG_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', onSuccess: sinon.stub() };
      const sagaSuccess = deleteOrg(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteOrg(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_ORG_REJECTED, payload: error })
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

    it('should fork a watcher for fetchOrgs', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ORGS_REQUEST, fetchOrgs)
      );
    });

    it('should fork a watcher for fetchOrg', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ORG_REQUEST, fetchOrg)
      );
    });

    it('should fork a watcher for fetchOrgSet', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ORGSET_REQUEST, fetchOrgSet)
      );
    });

    it('should fork a watcher for createOrg', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.CREATE_ORG_REQUEST, createOrg)
      );
    });

    it('should fork a watcher for updateOrg', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.UPDATE_ORG_REQUEST, updateOrg)
      );
    });

    it('should fork a watcher for deleteOrg', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DELETE_ORG_REQUEST, deleteOrg)
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
