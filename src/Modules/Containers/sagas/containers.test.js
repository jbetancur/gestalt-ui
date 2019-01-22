import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import { fetchAPI } from 'config/lib/utility';
import { notificationActions } from 'Modules/Notifications';
import { volumeActions } from 'Modules/Volumes';
import containerSagas, {
  fetchContainers,
  fetchContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  scaleContainer,
  migrateContainer,
  promoteContainer,
  watchContainerRequestWorkflow,
  watchContainersRequestWorkflow,
} from './containers';
import * as types from '../constants';
import { setSelectedProvider } from '../actions';

describe('Container Sagas', () => {
  const error = 'an error has occured';

  describe('fetchContainers Sequence with an environmentId', () => {
    const action = { fqon: 'iamfqon', entityKey: 'environments', entityId: '1' };
    const saga = fetchContainers(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(fetchAPI, 'iamfqon/environments/1/containers?expand=true&embed=apiendpoints&embed=provider')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 2 }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_CONTAINERS_FULFILLED,
          payload: [{ id: 2 }],
          action,
        }),
      );
    });
  });

  describe('fetchContainers Sequence with no environmentId', () => {
    const action = { fqon: 'iamfqon' };
    const saga = fetchContainers(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(fetchAPI, 'iamfqon/containers?expand=true&embed=apiendpoints&embed=provider')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 2 }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_CONTAINERS_FULFILLED,
          payload: [{ id: 2 }],
          action,
        }),
      );
    });
  });

  describe('fetchContainers Sequence when there is an error', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchContainers({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_CONTAINERS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchContainer Sequence', () => {
    describe('when there are NO env variables to merge', () => {
      const action = { fqon: 'iamfqon', lambdaId: 1, environmentId: 2 };
      const saga = fetchContainer(action);
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.all, [axios.get('iamfqon/containers/1'), axios.get('iamfqon/environments/2/env')])
        );
      });

      it('should dispatch an action to set the selectedProvider', () => {
        const promiseArray = [{ data: { id: 1, properties: { env: {}, provider: { id: '321' }, } } }, { data: { test: 'testvar' } }];
        result = saga.next(promiseArray);

        expect(result.value).toEqual(
          put(setSelectedProvider({ id: '321' })),
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next();

        expect(result.value).toEqual(
          put({ type: types.FETCH_CONTAINER_FULFILLED, payload: { id: 1, properties: { env: [{ name: 'test', value: 'testvar', inherited: true }], provider: { id: '321' } } }, action })
        );
      });
    });

    describe('when there ARE env variables to merge from the parent', () => {
      const action = { fqon: 'iamfqon', lambdaId: 1, environmentId: 2 };
      const saga = fetchContainer(action);
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.all, [axios.get('iamfqon/containers/1'), axios.get('iamfqon/environments/2/env')])
        );
      });

      it('should dispatch an action to set the selectedProvider', () => {
        const promiseArray = [
          { data: { id: 1, properties: { env: { test: 'morty' }, provider: { id: '321' } } } },
          { data: { test: 'rick' } },
        ];
        result = saga.next(promiseArray);

        expect(result.value).toEqual(
          put(setSelectedProvider({ id: '321' })),
        );
      });

      it('should return a payload and dispatch a success status and override the parents env vars', () => {
        result = saga.next();
        const payload = {
          id: 1, properties: { env: [{ name: 'test', value: 'morty', inherited: false }], provider: { id: '321' } }
        };
        expect(result.value).toEqual(
          put({ type: types.FETCH_CONTAINER_FULFILLED, payload, action })
        );
      });
    });
  });

  describe('createContainer Sequence', () => {
    const resource = { data: { id: 1, name: 'test', properties: { volumes: [] } } };
    const action = { fqon: 'iamfqon', environmentId: '1', payload: { name: 'iamnewContainer' } };
    const saga = createContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/environments/1/containers?embed=provider&embed=volumes', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next(resource);
      expect(result.value).toEqual(
        put({ type: types.CREATE_CONTAINER_FULFILLED, payload: resource.data })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test Container created' }))
      );
    });

    it('should dispatch a volume update', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(volumeActions.setVolumes([])),
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = createContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1, properties: { volumes: [] } } });
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith({ id: 1, properties: { volumes: [] } });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.CREATE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('updateContainer Sequence', () => {
    const resource = { data: { id: 1, name: 'test', properties: { volumes: [] } } };
    const action = { fqon: 'iamfqon', containerId: '1', payload: [] };
    const saga = updateContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.put, 'iamfqon/containers/1?embed=provider&embed=volumes', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next(resource);
      expect(result.value).toEqual(
        put({ type: types.UPDATE_CONTAINER_FULFILLED, payload: resource.data })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test Container updated' }))
      );
    });

    it('should dispatch a volume update', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(volumeActions.setVolumes([])),
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', environmentId: '1', payload: [], onSuccess: jest.fn() };
      const sagaSuccess = updateContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1, properties: { volumes: [] } } });
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith({ id: 1, properties: { volumes: [] } });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateContainer(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: types.UPDATE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('deleteContainer Sequence', () => {
    const resource = { id: '1', name: 'test' };
    const action = { fqon: 'iamfqon', resource };
    const saga = deleteContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/containers/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_CONTAINER_FULFILLED, payload: resource })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test Container destroyed' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = deleteContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('scaleContainer Sequence', () => {
    const action = { fqon: 'iamfqon', containerId: '2', numInstances: 42 };
    const saga = scaleContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/containers/2/scale?numInstances=42&embed=provider&embed=volumes')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.SCALE_CONTAINER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = scaleContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = scaleContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.SCALE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('migrateContainer Sequence', () => {
    const action = { fqon: 'iamfqon', containerId: '2', providerId: '42' };
    const saga = migrateContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/containers/2/migrate?provider=42&embed=provider&embed=volumes')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.MIGRATE_CONTAINER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = migrateContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({});
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = migrateContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.MIGRATE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('promoteContainer Sequence', () => {
    const action = { fqon: 'iamfqon', containerId: '2', environmentId: '42' };
    const saga = promoteContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/containers/2/promote?target=42&embed=provider&embed=volumes')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next({});
      expect(result.value).toEqual(
        put({ type: types.PROMOTE_CONTAINER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = promoteContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({});
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = promoteContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.PROMOTE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('containerSagas', () => {
    let result;
    const rootSaga = containerSagas();

    it('should fork a watcher for fetchContainers', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchContainersRequestWorkflow)
      );
    });

    it('should fork a watcher for fetchContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchContainerRequestWorkflow)
      );
    });

    it('should fork a watcher for createContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(types.CREATE_CONTAINER_REQUEST, createContainer)
      );
    });

    it('should fork a watcher for updateContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(types.UPDATE_CONTAINER_REQUEST, updateContainer)
      );
    });

    it('should fork a watcher for deleteContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(types.DELETE_CONTAINER_REQUEST, deleteContainer)
      );
    });

    it('should fork a watcher for scaleContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(types.SCALE_CONTAINER_REQUEST, scaleContainer)
      );
    });

    it('should fork a watcher for migrateContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(types.MIGRATE_CONTAINER_REQUEST, migrateContainer)
      );
    });

    it('should fork a watcher for promoteContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(types.PROMOTE_CONTAINER_REQUEST, promoteContainer)
      );
    });
  });
});
