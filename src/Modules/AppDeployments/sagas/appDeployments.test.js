import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import { notificationActions } from 'Modules/Notifications';
import { fetchAPI } from 'config/lib/utility';
import appDeploymentSagas, {
  fetchAppDeployments,
  createAppDeployment,
  deleteAppDeployment,
  deleteAppDeployments,
  createViewWorkflow,
} from './appDeployments';
import {
  FETCH_APPDEPLOYMENTS_REQUEST,
  FETCH_APPDEPLOYMENTS_FULFILLED,
  FETCH_APPDEPLOYMENTS_REJECTED,
  CREATE_APPDEPLOYMENT_REQUEST,
  CREATE_APPDEPLOYMENT_FULFILLED,
  CREATE_APPDEPLOYMENT_REJECTED,
  DELETE_APPDEPLOYMENTS_REQUEST,
  DELETE_APPDEPLOYMENT_REQUEST,
  DELETE_APPDEPLOYMENT_FULFILLED,
  DELETE_APPDEPLOYMENT_REJECTED,
  INIT_APPDEPLOYMENTCREATE_REQUEST,
  INIT_APPDEPLOYMENTCREATE_FULFILLED,
  INIT_APPDEPLOYMENTCREATE_REJECTED,
} from '../constants';

describe('AppDeployment Sagas', () => {
  const error = 'an error has occured';

  describe('fetchAppDeployments Sequence with an environmentId', () => {
    const saga = fetchAppDeployments();
    let result;

    it('should make an api call', () => {
      result = saga.next();
      result = saga.next('1'); // this environment id state that should exist
      result = saga.next({ environment: { id: '1', org: { properties: { fqon: 'test' } } } }); // mock state
      expect(result.value).toEqual(
        call(fetchAPI, 'test/environments/1/appdeployments?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: '2' }] });
      expect(result.value).toEqual(
        put({
          type: FETCH_APPDEPLOYMENTS_FULFILLED,
          payload: [{ id: '2' }]
        })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAppDeployments();
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_APPDEPLOYMENTS_REJECTED, payload: error })
      );
    });
  });

  describe('createAppDeployment Sequence', () => {
    const action = { providerId: 'xxx', namespace: 'hello', releaseName: 'world', payload: { name: 'iamnewapp' } };
    const saga = createAppDeployment(action);
    const expectedPayload = { id: '234', name: 'test', properties: {} };
    let result;

    it('should make an api call to create', () => {
      result = saga.next();
      result = saga.next('1'); // this environment id state that should exist
      result = saga.next({ environment: { id: '1', org: { properties: { fqon: 'test' } } } }); // mock state
      expect(result.value).toEqual(
        call(
          axios.post,
          'test/providers/xxx/kube/chart?namespace=hello&source=helm&releaseName=world&metaEnv=1',
          action.payload,
          { headers: { 'Content-Type': 'application/yaml' } })
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: expectedPayload });

      expect(result.value).toEqual(
        put({ type: CREATE_APPDEPLOYMENT_FULFILLED, payload: expectedPayload })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test App Deployment created' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = createAppDeployment(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next('1'); // this environment id state that should exist
      sagaSuccess.next({ environment: { id: '1', org: { properties: { fqon: 'test' } } } }); // mock state
      sagaSuccess.next({ data: expectedPayload });
      sagaSuccess.next();
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).toBeCalledWith(expectedPayload);
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createAppDeployment(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: CREATE_APPDEPLOYMENT_REJECTED, payload: error })
      );
    });
  });

  describe('deleteAppDeployment Sequence', () => {
    const resource = { id: 1, name: 'test', org: { properties: { fqon: 'test' } }, properties: {} };
    const action = { fqon: 'test', resource };
    const saga = deleteAppDeployment(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'test/appdeployments/1?force=false')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: DELETE_APPDEPLOYMENT_FULFILLED, payload: resource })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test App Deployment deleted' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = deleteAppDeployment(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteAppDeployment(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: DELETE_APPDEPLOYMENT_REJECTED, payload: error })
      );
    });
  });

  describe('deleteAppDeployments Sequence', () => {
    const resource = { id: 1, name: 'test', org: { properties: { fqon: 'test' } }, properties: {} };
    const action = { resources: [resource], fqon: 'test' };
    const saga = deleteAppDeployments(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.all, [axios.delete('test/appdeployments/1?force=false')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: DELETE_APPDEPLOYMENT_FULFILLED, payload: [resource] })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test app deployments deleted' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = deleteAppDeployments(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteAppDeployments(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: DELETE_APPDEPLOYMENT_REJECTED, payload: error })
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
            axios.get('test/environments/123/providers?expand=true&type=Kubernetes'),
          ]),
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: [{ name: 'a kube provider' }] },

        ]);

        const payload = {
          providers: [{ name: 'a kube provider' }],
        };

        expect(result.value).toEqual(
          put({ type: INIT_APPDEPLOYMENTCREATE_FULFILLED, payload })
        );
      });
    });

    describe('when there is an Error', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = createViewWorkflow();
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: INIT_APPDEPLOYMENTCREATE_REJECTED, payload: error })
        );
      });
    });
  });

  describe('appDeployment Saga Watchers', () => {
    let result;
    const rootSaga = appDeploymentSagas();

    it('should fork a watcher for fetchAppDeployments', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, FETCH_APPDEPLOYMENTS_REQUEST, fetchAppDeployments)
      );
    });

    it('should fork a watcher for createAppDeployment', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, CREATE_APPDEPLOYMENT_REQUEST, createAppDeployment)
      );
    });

    it('should fork a watcher for deleteAppDeployment', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, DELETE_APPDEPLOYMENT_REQUEST, deleteAppDeployment)
      );
    });

    it('should fork a watcher for deleteAppDeployments', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, DELETE_APPDEPLOYMENTS_REQUEST, deleteAppDeployments)
      );
    });

    it('should fork a watcher for createViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, INIT_APPDEPLOYMENTCREATE_REQUEST, createViewWorkflow)
      );
    });
  });
});
