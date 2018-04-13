import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import lambdaSagas, {
  fetchLambdas,
  fetchLambda,
  createLambda,
  updateLambda,
  deleteLambda,
  deleteLambdas,
  fetchLambdaProvider,
} from './lambdas';
import * as types from '../actionTypes';

describe('Lambda Sagas', () => {
  const error = 'an error has occured';

  describe('fetchLambdas Sequence with an environmentId', () => {
    const saga = fetchLambdas({ fqon: 'iamfqon', environmentId: '1' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/environments/1/lambdas?expand=true&embed=apiendpoints')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 2 }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_LAMBDAS_FULFILLED,
          payload: [{ id: 2 }] })
      );
    });
  });

  describe('fetchLambdas Sequence with no environmentId', () => {
    const saga = fetchLambdas({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/lambdas?expand=true&embed=apiendpoints')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 2 }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_LAMBDAS_FULFILLED,
          payload: [{ id: 2 }] })
      );
    });
  });

  describe('fetchLambdas Sequence when there is an error', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchLambdas({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_LAMBDAS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchLambda Sequence', () => {
    describe('when there are only inheritied variables', () => {
      const saga = fetchLambda({ fqon: 'iamfqon', lambdaId: 1 });
      let result;
      it('should make an api call for the lambda by id', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/lambdas/1')
        );
      });

      it('should make an api call for the environment envs', () => {
        result = saga.next({ data: { id: 1, properties: { parent: { href: 'iamfqon/environments/2' } } } });
        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/environments/2/env')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { test: 'testvar' } });

        const expectedPayload = { id: 1, properties: { parent: { href: 'iamfqon/environments/2' }, env: [{ name: 'test', value: 'testvar', inherited: true }] } };
        expect(result.value).toEqual(
          put({ type: types.FETCH_LAMBDA_FULFILLED, payload: expectedPayload })
        );
      });
    });

    describe('when there are both own and inherited env vars', () => {
      const saga = fetchLambda({ fqon: 'iamfqon', lambdaId: 1, environmentId: 2 });
      let result;
      it('should make an api call for the lambda by id', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/lambdas/1')
        );
      });

      it('should make an api call for the environment envs', () => {
        result = saga.next({ data: { id: 1, properties: { parent: { href: 'iamfqon/environments/2' }, env: { rick: 'morty' } } } });
        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/environments/2/env')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { test: 'testvar' } });

        const expectedPayload = { id: 1, properties: { parent: { href: 'iamfqon/environments/2' }, env: [{ name: 'test', value: 'testvar', inherited: true }, { name: 'rick', value: 'morty', inherited: false }] } };
        expect(result.value).toEqual(
          put({ type: types.FETCH_LAMBDA_FULFILLED, payload: expectedPayload })
        );
      });
    });

    describe('when there is an Error', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = fetchLambda({ fqon: 'iamfqon' });
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: types.FETCH_LAMBDA_REJECTED, payload: error })
        );
      });
    });
  });

  describe('createLambda Sequence', () => {
    const action = { fqon: 'iamfqon', environmentId: '1', payload: { name: 'iamnewlambda' } };
    const saga = createLambda(action);
    const expectedPayload = { id: 1, properties: { parent: { href: 'iamfqon/environments/2' }, env: [{ name: 'test', value: 'testvar', inherited: true }] } };
    let result;

    it('should make an api call for the lambda by id', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/environments/1/lambdas', action.payload)
      );
    });

    it('should make an api call for the environment envs', () => {
      result = saga.next({ data: { id: 1, properties: { parent: { href: 'iamfqon/environments/2' } } } });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/environments/2/env')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { test: 'testvar' } });

      expect(result.value).toEqual(
        put({ type: types.CREATE_LAMBDA_FULFILLED, payload: expectedPayload })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createLambda(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1, properties: { parent: { href: 'iamfqon/environments/2' } } } });
      sagaSuccess.next({ data: { test: 'testvar' } });
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).to.have.been.calledWith(expectedPayload);
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createLambda(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.CREATE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('updateLambda Sequence', () => {
    const action = { fqon: 'iamfqon', lambdaId: '1', environmentId: '2', payload: [] };
    const saga = updateLambda(action);
    const expectedPayload = { id: 1, properties: { parent: { href: 'iamfqon/environments/2' }, env: [{ name: 'test', value: 'testvar', inherited: true }] } };
    let result;

    it('should make an api call to PATCH the lambda', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/lambdas/1', action.payload)
      );
    });

    it('should make an api call for the environment envs', () => {
      result = saga.next({ data: { id: 1, properties: { parent: { href: 'iamfqon/environments/2' } } } });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/environments/2/env')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { test: 'testvar' } });

      expect(result.value).toEqual(
        put({ type: types.UPDATE_LAMBDA_FULFILLED, payload: expectedPayload })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createLambda(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1, properties: { parent: { href: 'iamfqon/environments/2' } } } });
      sagaSuccess.next({ data: { test: 'testvar' } });
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).to.have.been.calledWith(expectedPayload);
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateLambda(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: types.UPDATE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('deleteLambda Sequence', () => {
    const action = { fqon: 'iamfqon', lambdaId: '1' };
    const saga = deleteLambda(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/lambdas/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_LAMBDA_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteLambda(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteLambda(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('deleteLambdas Sequence', () => {
    const action = { lambdaIds: ['1'], fqon: 'iamfqon' };
    const saga = deleteLambdas(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.all, [axios.delete('iamfqon/lambdas/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_LAMBDA_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteLambdas(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteLambdas(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('fetchLambdaProvider Sequence', () => {
    const saga = fetchLambdaProvider({ fqon: 'iamfqon', lambdaId: 1 });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/lambdas/1')
      );
    });

    it('should make an api call for the provider', () => {
      result = saga.next({ data: { id: 2, properties: { provider: { id: 42 } } } });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/providers/42')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 2 } });
      expect(result.value).toEqual(
        put({ type: types.FETCH_LAMBDA_PROVIDER_FULFILLED, payload: { id: 2 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchLambdaProvider({ fqon: 'iamfqon', lambdaId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_LAMBDA_PROVIDER_REJECTED, payload: error })
      );
    });
  });


  describe('lambdaSagas', () => {
    let result;
    const rootSaga = lambdaSagas();

    it('should fork a watcher for fetchLambdas', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_LAMBDAS_REQUEST, fetchLambdas)
      );
    });

    it('should fork a watcher for fetchLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_LAMBDA_REQUEST, fetchLambda)
      );
    });

    it('should fork a watcher for createLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.CREATE_LAMBDA_REQUEST, createLambda)
      );
    });

    it('should fork a watcher for updateLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.UPDATE_LAMBDA_REQUEST, updateLambda)
      );
    });

    it('should fork a watcher for deleteLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DELETE_LAMBDA_REQUEST, deleteLambda)
      );
    });

    it('should fork a watcher for deleteLambdas', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DELETE_LAMBDAS_REQUEST, deleteLambdas)
      );
    });

    it('should fork a watcher for fetchLambdaProvider', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_LAMBDA_PROVIDER_REQUEST, fetchLambdaProvider)
      );
    });
  });
});
