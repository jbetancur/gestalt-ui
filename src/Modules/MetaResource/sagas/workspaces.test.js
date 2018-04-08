import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import workspaceSagas, {
  fetchWorkspaces,
  fetchWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from './workspaces';
import * as types from '../actionTypes';

describe('Workspace Sagas', () => {
  const error = 'an error has occured';

  describe('fetchWorkspaces Sequence', () => {
    const saga = fetchWorkspaces({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/workspaces?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).toEqual(
        put({ type: types.FETCH_WORKSPACES_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchWorkspaces({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_WORKSPACES_REJECTED, payload: error })
      );
    });
  });

  describe('fetchWorkspace Sequence', () => {
    const saga = fetchWorkspace({ fqon: 'iamfqon', workspaceId: 1 });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/workspaces/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.FETCH_WORKSPACE_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchWorkspace({ fqon: 'iamfqon', workspaceId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_WORKSPACE_REJECTED, payload: error })
      );
    });
  });

  describe('createWorkspace Sequence', () => {
    const action = { fqon: 'iamfqon', payload: { name: 'iamnewfqon' } };
    const saga = createWorkspace(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, `${action.fqon}/workspaces`, action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.CREATE_WORKSPACE_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', workspaceId: '1', payload: { name: 'iamnewfqon' }, onSuccess: sinon.stub() };
      const sagaSuccess = createWorkspace(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createWorkspace(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.CREATE_WORKSPACE_REJECTED, payload: error })
      );
    });
  });

  describe('updateWorkspace Sequence', () => {
    const action = { fqon: 'iamfqon', workspaceId: '1', payload: [] };
    const saga = updateWorkspace(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, `${action.fqon}/workspaces/${action.workspaceId}`, action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.UPDATE_WORKSPACE_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', workspaceId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateWorkspace(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateWorkspace(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: types.UPDATE_WORKSPACE_REJECTED, payload: error })
      );
    });
  });

  describe('deleteWorkspace Sequence', () => {
    const action = { fqon: 'iamfqon', workspaceId: '1' };
    const saga = deleteWorkspace(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, `${action.fqon}/workspaces/${action.workspaceId}?force=true`)
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_WORKSPACE_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', onSuccess: sinon.stub() };
      const sagaSuccess = deleteWorkspace(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteWorkspace(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_WORKSPACE_REJECTED, payload: error })
      );
    });
  });

  describe('workspaceSagas', () => {
    let result;
    const rootSaga = workspaceSagas();

    it('should fork a watcher for fetchWorkspaces', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_WORKSPACES_REQUEST, fetchWorkspaces)
      );
    });


    it('should fork a watcher for fetchWorkspace', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_WORKSPACE_REQUEST, fetchWorkspace)
      );
    });

    it('should fork a watcher for createWorkspace', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.CREATE_WORKSPACE_REQUEST, createWorkspace)
      );
    });

    it('should fork a watcher for updateWorkspace', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.UPDATE_WORKSPACE_REQUEST, updateWorkspace)
      );
    });

    it('should fork a watcher for deleteWorkspace', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DELETE_WORKSPACE_REQUEST, deleteWorkspace)
      );
    });
  });
});
