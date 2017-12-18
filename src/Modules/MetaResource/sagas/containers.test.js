import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import containerSagas, {
  fetchContainers,
  fetchContainersDropDown,
  fetchContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  scaleContainer,
  migrateContainer,
  promoteContainer,
  fetchProviderContainer,
} from './containers';
import * as types from '../actionTypes';

describe('Container Sagas', () => {
  const error = 'an error has occured';

  describe('fetchContainers Sequence with an environmentId', () => {
    const saga = fetchContainers({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/environments/1/containers?expand=true')
      );
    });

    it('should make an api call for endpoints', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/apiendpoints?expand=true&implementation_type=container&implementation_id=1')
      );
    });

    it('should make an api call for the provider', () => {
      result = saga.next({ data: [{ id: 1, properties: { parent: { name: 'testapi' }, resource: '/testapi', location_id: 42 } }] });
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/providers/42')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1, properties: { config: { env: { public: { PUBLIC_URL_VHOST_0: 'vhostness' } }, external_protocol: 'https' } } } });
      expect(result.value).to.deep.equal(
        put({
          type: types.FETCH_CONTAINERS_FULFILLED,
          payload: [
            { id: 1, properties: { apiEndpoints: [{ id: 1, properties: { public_url: 'https://vhostness/testapi/testapi', parent: { name: 'testapi' }, resource: '/testapi', location_id: 42 } }] } }]
        })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchContainers({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_CONTAINERS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchContainers Sequence without an environmentId', () => {
    const saga = fetchContainers({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/containers?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      result = saga.next({ data: [{ id: 1, properties: { parent: { name: 'testapi' }, resource: '/testapi', location_id: 42 } }] });
      result = saga.next({ data: { id: 1, properties: { config: { env: { public: { PUBLIC_URL_VHOST_0: 'vhostness' } }, external_protocol: 'https' } } } });
      expect(result.value).to.deep.equal(
        put({
          type: types.FETCH_CONTAINERS_FULFILLED,
          payload: [
            { id: 1, properties: { apiEndpoints: [{ id: 1, properties: { public_url: 'https://vhostness/testapi/testapi', parent: { name: 'testapi' }, resource: '/testapi', location_id: 42 } }] } }]
        })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchContainers({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_CONTAINERS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchContainersDropDown Sequence', () => {
    describe('fetchProvidersByType when there are containers', () => {
      const saga = fetchContainersDropDown({ fqon: 'iamfqon', environmentId: '1' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/containers?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [{ id: 1 }] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINERS_DROPDOWN_FULFILLED, payload: [{ id: 1 }] })
        );
      });

      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = fetchContainersDropDown({ fqon: 'iamfqon' });
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINERS_DROPDOWN_REJECTED, payload: error })
        );
      });
    });

    describe('fetchContainersDropDown when there are NO containers', () => {
      const saga = fetchContainersDropDown({ fqon: 'iamfqon', environmentId: 1 });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/containers?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINERS_DROPDOWN_FULFILLED, payload: [{ id: '', name: 'No Available Containers' }] })
        );
      });
    });
  });

  describe('fetchContainer Sequence', () => {
    describe('when there are NO env variables to merge', () => {
      const saga = fetchContainer({ fqon: 'iamfqon', lambdaId: 1, environmentId: 2 });
      let result;
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.all, [axios.get('iamfqon/containers/1'), axios.get('iamfqon/environments/2/env')])
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const promiseArray = [{ data: { id: 1, properties: { env: {} } } }, { data: { test: 'testvar' } }];
        result = saga.next(promiseArray);

        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINER_FULFILLED, payload: { id: 1, properties: { env: { test: 'testvar' } } } })
        );
      });
    });

    describe('when there ARE env variables to merge from the parent', () => {
      const saga = fetchContainer({ fqon: 'iamfqon', lambdaId: 1, environmentId: 2 });
      let result;
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.all, [axios.get('iamfqon/containers/1'), axios.get('iamfqon/environments/2/env')])
        );
      });

      it('should return a payload and dispatch a success status and override the parents env vars', () => {
        const promiseArray = [{ data: { id: 1, properties: { env: { test: 'morty' } } } }, { data: { test: 'rick' } }];
        result = saga.next(promiseArray);

        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINER_FULFILLED, payload: { id: 1, properties: { env: { test: 'morty' } } } })
        );
      });
    });
  });

  describe('createContainer Sequence', () => {
    const action = { fqon: 'iamfqon', environmentId: '1', payload: { name: 'iamnewContainer' } };
    const saga = createContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/environments/1/containers', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.CREATE_CONTAINER_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('updateContainer Sequence', () => {
    const action = { fqon: 'iamfqon', containerId: '1', payload: [] };
    const saga = updateContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.put, 'iamfqon/containers/1', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_CONTAINER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', environmentId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateContainer(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_CONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('deleteContainer Sequence', () => {
    const action = { fqon: 'iamfqon', containerId: '1' };
    const saga = deleteContainer(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/containers/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_CONTAINER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
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
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/containers/2/scale?numInstances=42')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.SCALE_CONTAINER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = scaleContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = scaleContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
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
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/containers/2/migrate?provider=42')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next({});
      expect(result.value).to.deep.equal(
        put({ type: types.MIGRATE_CONTAINER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = migrateContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({});
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = migrateContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
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
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/containers/2/promote?target=42')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next({});
      expect(result.value).to.deep.equal(
        put({ type: types.PROMOTE_CONTAINER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = promoteContainer(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({});
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = promoteContainer(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.PROMOTE_CONTAINER_REJECTED, payload: error })
      );
    });
  });


  describe('fetchProviderContainer Sequence', () => {
    const action = { fqon: 'iamfqon', providerId: '1' };
    let result;

    describe('when there is a container', () => {
      const saga = fetchProviderContainer(action);

      it('should make an api call to get containers', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers/1/containers')
        );
      });

      it('should make an api call to get container', () => {
        result = saga.next({ data: [{ id: 1 }] });
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/containers/1')
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next({ data: { id: 1, name: 'yay' } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINER_FULFILLED, payload: { id: 1, name: 'yay' } })
        );

        // Finish the iteration
        result = saga.next();
      });

      it('should dispatch a reject status when there is an error', () => {
        const sagaError = fetchProviderContainer(action);
        let resultError = sagaError.next();
        resultError = sagaError.throw({ message: error });

        expect(resultError.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINER_REJECTED, payload: error })
        );
      });
    });

    describe('when there is no container response', () => {
      const saga = fetchProviderContainer(action);

      it('should make an api call to get containers', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers/1/containers')
        );
      });

      it('should make an api call to get container', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINER_FULFILLED })
        );

        // Finish the iteration
        result = saga.next();
      });

      it('should dispatch a reject status when there is an error', () => {
        const sagaError = fetchProviderContainer(action);
        let resultError = sagaError.next();
        resultError = sagaError.throw({ message: error });

        expect(resultError.value).to.deep.equal(
          put({ type: types.FETCH_CONTAINER_REJECTED, payload: error })
        );
      });
    });
  });

  describe('containerSagas', () => {
    let result;
    const rootSaga = containerSagas();

    it('should fork a watcher for fetchContainers', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_CONTAINERS_REQUEST, fetchContainers)
      );
    });

    it('should fork a watcher for fetchContainersDropDown', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_CONTAINERS_DROPDOWN_REQUEST, fetchContainersDropDown)
      );
    });

    it('should fork a watcher for fetchContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_CONTAINER_REQUEST, fetchContainer)
      );
    });

    it('should fork a watcher for createContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_CONTAINER_REQUEST, createContainer)
      );
    });

    it('should fork a watcher for updateContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_CONTAINER_REQUEST, updateContainer)
      );
    });

    it('should fork a watcher for deleteContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_CONTAINER_REQUEST, deleteContainer)
      );
    });

    it('should fork a watcher for scaleContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.SCALE_CONTAINER_REQUEST, scaleContainer)
      );
    });

    it('should fork a watcher for migrateContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.MIGRATE_CONTAINER_REQUEST, migrateContainer)
      );
    });

    it('should fork a watcher for promoteContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.PROMOTE_CONTAINER_REQUEST, promoteContainer)
      );
    });

    it('should fork a watcher for fetchProviderContainer', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_PROVIDER_CONTAINER_REQUEST, fetchProviderContainer)
      );
    });
  });
});
