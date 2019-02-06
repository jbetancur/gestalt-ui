import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import { notificationActions } from 'Modules/Notifications';
import { fetchAPI } from 'config/lib/utility';
import lambdaSagas, {
  fetchLambdas,
  createLambda,
  updateLambda,
  deleteLambda,
  deleteLambdas,
  createViewWorkflow,
  editViewWorkflow,
  watchCreateWorkflow,
  watchEditViewWorkflow,
} from './lambdas';
import {
  FETCH_LAMBDAS_REQUEST,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDAS_REJECTED,
  CREATE_LAMBDA_REQUEST,
  CREATE_LAMBDA_FULFILLED,
  CREATE_LAMBDA_REJECTED,
  UPDATE_LAMBDA_REQUEST,
  UPDATE_LAMBDA_FULFILLED,
  UPDATE_LAMBDA_REJECTED,
  DELETE_LAMBDAS_REQUEST,
  DELETE_LAMBDA_REQUEST,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
  INIT_LAMBDACREATE_FULFILLED,
  INIT_LAMBDACREATE_REJECTED,
  INIT_LAMBDAEDIT_FULFILLED,
  INIT_LAMBDAEDIT_REJECTED,
} from '../actionTypes';
import lambdaModel from '../models/lambda';

describe('Lambda Sagas', () => {
  const error = 'an error has occured';

  describe('fetchLambdas Sequence with an environmentId', () => {
    const saga = fetchLambdas({ fqon: 'iamfqon', environmentId: '1' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(fetchAPI, 'iamfqon/environments/1/lambdas?expand=true&embed=apiendpoints&embed=provider')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 2 }] });
      expect(result.value).toEqual(
        put({
          type: FETCH_LAMBDAS_FULFILLED,
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
        call(fetchAPI, 'iamfqon/lambdas?expand=true&embed=apiendpoints&embed=provider')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 2 }] });
      expect(result.value).toEqual(
        put({
          type: FETCH_LAMBDAS_FULFILLED,
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
        put({ type: FETCH_LAMBDAS_REJECTED, payload: error })
      );
    });
  });

  describe('createLambda Sequence', () => {
    const action = { fqon: 'iamfqon', environmentId: '1', payload: { name: 'iamnewlambda' } };
    const saga = createLambda(action);
    const responsePayload = lambdaModel.schema.cast({ id: 1, name: 'test' });
    const expectedPayload = lambdaModel.get({ id: 1, name: 'test' });
    let result;

    it('should make an api call for the lambda by id', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/environments/1/lambdas?embed=provider', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: responsePayload });

      expect(result.value).toEqual(
        put({ type: CREATE_LAMBDA_FULFILLED, payload: expectedPayload })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test Lambda created' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = createLambda(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: responsePayload });
      sagaSuccess.next();
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).toBeCalledWith(expectedPayload);
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createLambda(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: CREATE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('updateLambda Sequence', () => {
    const action = { fqon: 'iamfqon', lambdaId: '1', environmentId: '2', payload: [] };
    const saga = updateLambda(action);
    const envVar = { test: 'testvar' };
    const responsePayload = lambdaModel.schema.cast({ id: 1, name: 'test', properties: { parent: { href: 'iamfqon/environments/2' } } });
    const expectedPayload = lambdaModel.get({ id: 1, name: 'test', properties: { parent: { href: 'iamfqon/environments/2' } } }, envVar);
    let result;

    it('should make an api call to PATCH the lambda', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/lambdas/1?embed=provider', action.payload)
      );
    });

    it('should make an api call for the environment envs', () => {
      result = saga.next({ data: responsePayload });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/environments/2/env')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: envVar });

      expect(result.value).toEqual(
        put({ type: UPDATE_LAMBDA_FULFILLED, payload: expectedPayload })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test Lambda updated' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = updateLambda(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: responsePayload });
      sagaSuccess.next({ data: envVar });
      sagaSuccess.next();
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).toBeCalledWith(expectedPayload);
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateLambda(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: UPDATE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('deleteLambda Sequence', () => {
    const resource = { id: 1, name: 'test' };
    const action = { fqon: 'iamfqon', resource };
    const saga = deleteLambda(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/lambdas/1?force=false')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: DELETE_LAMBDA_FULFILLED, payload: resource })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test Lambda deleted' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = deleteLambda(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteLambda(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: DELETE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('deleteLambdas Sequence', () => {
    const resource = { id: 1, name: 'test' };
    const action = { resources: [resource], fqon: 'iamfqon' };
    const saga = deleteLambdas(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.all, [axios.delete('iamfqon/lambdas/1?force=false')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: DELETE_LAMBDA_FULFILLED, payload: [resource] })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test lambdas deleted' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = deleteLambdas(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteLambdas(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: DELETE_LAMBDA_REJECTED, payload: error })
      );
    });
  });

  describe('createViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = createViewWorkflow();
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next('123'); // this environment id state that should exist
        result = saga.next({ environment: { id: '123', org: { properties: { fqon: 'test' } } } }); // mock state
        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/environments/123/providers?expand=true&type=Lambda'),
            axios.get('test/environments/123/providers?expand=true&type=Executor'),
            axios.get('test/environments/123/secrets?expand=true'),
            axios.get('test/environments/123/env'),
          ]),
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: [{ name: 'a provider' }] },
          { data: [{ name: 'an executor' }] },
          { data: [{ name: 'a secret' }] },
          { data: { RICK: 'morty' } },

        ]);

        const payload = {
          providers: [{ name: 'a provider' }],
          executors: [{ name: 'an executor' }],
          secrets: [{ name: 'a secret' }],
          inheritedEnv: [{ name: 'RICK', value: 'morty', inherited: true }]
        };

        expect(result.value).toEqual(
          put({ type: INIT_LAMBDACREATE_FULFILLED, payload })
        );
      });
    });

    describe('when there is an Error', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = createViewWorkflow();
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: INIT_LAMBDACREATE_REJECTED, payload: error })
        );
      });
    });
  });


  describe('editViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = editViewWorkflow({ lambdaId: '890' });
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next('123'); // this environment id state that should exist
        result = saga.next({ environment: { id: '123', org: { properties: { fqon: 'test' } } } }); // mock state

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/lambdas/890?embed=provider'),
            axios.get('test/environments/123/providers?expand=true&type=Executor'),
            axios.get('test/environments/123/secrets?expand=true'),
          ]),
        );
      });

      it('should make an api call for the environment envs', () => {
        result = saga.next([
          { data: lambdaModel.schema.cast({ id: '890', name: 'a lambda', properties: { parent: { href: 'iamfqon/environments/2' } } }) },
          { data: [{ name: 'an executor' }] },
          { data: [{ name: 'a secret' }] },
        ]);

        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/environments/2/env')
        );
      });

      it('should return a payload and dispatch a success status and merge any env vars', () => {
        result = saga.next({ data: { test: 'testvar' } });

        const payload = {
          executors: [{ name: 'an executor' }],
          secrets: [{ name: 'a secret' }],
          lambda: lambdaModel.get({ id: '890', name: 'a lambda', properties: { env: [{ name: 'test', value: 'testvar', inherited: true }], parent: { href: 'iamfqon/environments/2' } } }),
        };

        expect(result.value).toEqual(
          put({ type: INIT_LAMBDAEDIT_FULFILLED, payload })
        );
      });

      describe('when there is an Error', () => {
        it('should return a payload and dispatch a reject status when there is an error', () => {
          const sagaError = editViewWorkflow({ fqon: 'test' });
          let resultError = sagaError.next();

          resultError = sagaError.throw({ message: error });

          expect(resultError.value).toEqual(
            put({ type: INIT_LAMBDAEDIT_REJECTED, payload: error })
          );
        });
      });
    });
  });

  describe('lambdaSagas', () => {
    let result;
    const rootSaga = lambdaSagas();

    it('should fork a watcher for fetchLambdas', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(FETCH_LAMBDAS_REQUEST, fetchLambdas)
      );
    });

    it('should fork a watcher for createLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(CREATE_LAMBDA_REQUEST, createLambda)
      );
    });

    it('should fork a watcher for updateLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(UPDATE_LAMBDA_REQUEST, updateLambda)
      );
    });

    it('should fork a watcher for deleteLambda', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(DELETE_LAMBDA_REQUEST, deleteLambda)
      );
    });

    it('should fork a watcher for deleteLambdas', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(DELETE_LAMBDAS_REQUEST, deleteLambdas)
      );
    });

    it('should fork a watcher for createViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchCreateWorkflow)
      );
    });

    it('should fork a watcher for editViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchEditViewWorkflow)
      );
    });
  });
});
