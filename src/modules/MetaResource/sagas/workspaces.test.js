import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import workspaceSagas, {
  fetchWorkspaces,
  fetchWorkspace,
} from './workspaces';
import * as types from '../actionTypes';

describe('Workspace Sagas', () => {
  const error = 'an error has occured';

  describe('fetchWorkspaces Sequence', () => {
    const saga = fetchWorkspaces({ fqon: 'iamfqon' });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_WORKSPACES_PENDING })
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/workspaces?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_WORKSPACES_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchWorkspaces({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_WORKSPACES_REJECTED, payload: error })
      );
    });
  });

  describe('fetchWorkspace Sequence', () => {
    const saga = fetchWorkspace({ fqon: 'iamfqon', workspaceId: 1 });
    let result;

    it('should dispatch a pending status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_WORKSPACE_PENDING })
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
        put({ type: types.FETCH_WORKSPACE_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchWorkspace({ fqon: 'iamfqon', workspaceId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_WORKSPACE_REJECTED, payload: error })
      );
    });
  });

  describe('workspaceSagas', () => {
    let result;
    const rootSaga = workspaceSagas();

    it('should fork a watcher for fetchWorkspaces', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_WORKSPACES_REQUEST, fetchWorkspaces)
      );
    });


    it('should fork a watcher for fetchWorkspace', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_WORKSPACE_REQUEST, fetchWorkspace)
      );
    });
  });
});
