import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import contextSagas, {
  setOrgContext,
  setWorkspaceContext,
  setEnvironmentContext,
} from './contextMgmt';
import * as types from '../actionTypes';

describe('Context Sagas', () => {
  const error = 'an error has occured';

  describe('setOrgContext Sequence', () => {
    const saga = setOrgContext({ fqon: 'iamfqon' });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.SET_CURRENT_ORG_CONTEXT_PENDING })
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_CURRENT_ORG_CONTEXT, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = setOrgContext({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.SET_CURRENT_ORG_CONTEXT_REJECTED, payload: error })
      );
    });
  });

  describe('setWorkspaceContext Sequence', () => {
    const saga = setWorkspaceContext({ fqon: 'iamfqon', workspaceId: 1 });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.SET_CURRENT_WORKSPACE_CONTEXT_PENDING })
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/workspaces/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_CURRENT_WORKSPACE_CONTEXT, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = setWorkspaceContext({ fqon: 'iamfqon', workspaceId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.SET_CURRENT_WORKSPACE_CONTEXT_REJECTED, payload: error })
      );
    });
  });

  describe('setEnvironmentContext Sequence', () => {
    const saga = setEnvironmentContext({ fqon: 'iamfqon', environmentId: 1 });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.SET_CURRENT_ENVIRONMENT_CONTEXT_PENDING })
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
        put({ type: types.UPDATE_CURRENT_ENVIRONMENT_CONTEXT, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = setEnvironmentContext({ fqon: 'iamfqon', environmentId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.SET_CURRENT_ENVIRONMENT_CONTEXT_REJECTED, payload: error })
      );
    });
  });

  describe('contextSagas', () => {
    let result;
    const rootSaga = contextSagas();

    it('should fork a watcher for setOrgContext', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.SET_CURRENT_ORG_CONTEXT_REQUEST, setOrgContext)
      );
    });

    it('should fork a watcher for setWorkspaceContext', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.SET_CURRENT_WORKSPACE_CONTEXT_REQUEST, setWorkspaceContext)
      );
    });

    it('should fork a watcher for setEnvironmentContext', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.SET_CURRENT_ENVIRONMENT_CONTEXT_REQUEST, setEnvironmentContext)
      );
    });
  });
});
