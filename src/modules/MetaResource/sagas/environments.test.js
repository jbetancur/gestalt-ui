import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import environmentSagas, {
  fetchEnvironments,
  fetchEnvironment,
} from './environments';
import * as types from '../actionTypes';

describe('Workspace Sagas', () => {
  const error = 'an error has occured';

  describe('fetchEnvironments Sequence with a workspaceId', () => {
    const saga = fetchEnvironments({ fqon: 'iamfqon', workspaceId: '1' });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_PENDING })
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/workspaces/1/environments?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnvironments({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchEnvironments Sequence without a workspaceId', () => {
    const saga = fetchEnvironments({ fqon: 'iamfqon' });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_PENDING })
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/environments?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnvironments({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchEnvironment Sequence', () => {
    const saga = fetchEnvironment({ fqon: 'iamfqon', environmentId: 1 });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENT_PENDING })
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/environments/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENT_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnvironment({ fqon: 'iamfqon', environmentId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENT_REJECTED, payload: error })
      );
    });
  });

  describe('environmentSagas', () => {
    let result;
    const rootSaga = environmentSagas();

    it('should fork a watcher for fetchEnvironments', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_ENVIRONMENTS_REQUEST, fetchEnvironments)
      );
    });

    it('should fork a watcher for fetchEnvironment', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_ENVIRONMENT_REQUEST, fetchEnvironment)
      );
    });
  });
});
