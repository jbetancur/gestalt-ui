import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import environmentSagas, {
  fetchEnvironments,
  fetchEnvironment,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
} from './environments';
import * as types from '../actionTypes';

describe('Environment Sagas', () => {
  const error = 'an error has occured';

  describe('fetchEnvironments', () => {
    describe('fetchEnvironments Sequence with a workspaceId', () => {
      const saga = fetchEnvironments({ fqon: 'iamfqon', workspaceId: '1' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/workspaces/1/environments?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const model = { id: 1, properties: { workspace: { id: '123' } } };
        result = saga.next({ data: [model] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload: [model] })
        );
      });
    });

    describe('fetchEnvironments Sequence without a workspaceId', () => {
      const saga = fetchEnvironments({ fqon: 'iamfqon' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const model = { id: 1, properties: { workspace: { id: '123' } } };
        result = saga.next({ data: [model] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload: [model] })
        );
      });
    });

    describe('fetchEnvironments Sequence without properties.workspace', () => {
      const saga = fetchEnvironments({ fqon: 'iamfqon' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const model = { id: 1, properties: { workspace: null } };
        result = saga.next({ data: [model] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENVIRONMENTS_FULFILLED, payload: [] })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnvironments({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENTS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchEnvironment Sequence', () => {
    const saga = fetchEnvironment({ fqon: 'iamfqon', environmentId: 1 });
    let result;

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

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENVIRONMENT_REJECTED, payload: error })
      );
    });
  });

  describe('createEnvironment Sequence', () => {
    const action = { fqon: 'iamfqon', workspaceId: '1', payload: { name: 'iamnewfqon' } };
    const saga = createEnvironment(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, `${action.fqon}/workspaces/${action.workspaceId}/environments`, action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.CREATE_ENVIRONMENT_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', workspaceId: '1', payload: { name: 'iamnewfqon' }, onSuccess: sinon.stub() };
      const sagaSuccess = createEnvironment(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createEnvironment(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_ENVIRONMENT_REJECTED, payload: error })
      );
    });
  });

  describe('updateEnvironment Sequence', () => {
    const action = { fqon: 'iamfqon', environmentId: '1', payload: [] };
    const saga = updateEnvironment(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, `${action.fqon}/environments/${action.environmentId}`, action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_ENVIRONMENT_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', environmentId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateEnvironment(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateEnvironment(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_ENVIRONMENT_REJECTED, payload: error })
      );
    });
  });

  describe('deleteEnvironment Sequence', () => {
    const action = { fqon: 'iamfqon', environmentId: '1' };
    const saga = deleteEnvironment(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, `${action.fqon}/environments/${action.environmentId}?force=true`)
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_ENVIRONMENT_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', onSuccess: sinon.stub() };
      const sagaSuccess = deleteEnvironment(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteEnvironment(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_ENVIRONMENT_REJECTED, payload: error })
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

    it('should fork a watcher for createEnvironment', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_ENVIRONMENT_REQUEST, createEnvironment)
      );
    });

    it('should fork a watcher for updateEnvironment', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_ENVIRONMENT_REQUEST, updateEnvironment)
      );
    });

    it('should fork a watcher for deleteEnvironment', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_ENVIRONMENT_REQUEST, deleteEnvironment)
      );
    });
  });
});
