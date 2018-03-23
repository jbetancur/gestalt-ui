import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import providersagas, {
  fetchProviders,
  fetchProvidersByType,
  fetchProviderKongsByGateway,
  fetchExecutors,
  fetchProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  deleteProviders,
  redeployProvider,
} from './providers';
import providerModel from '../models/provider';
import * as types from '../actionTypes';

describe('Provider Sagas', () => {
  const error = 'an error has occured';

  describe('fetchProviders Sequence', () => {
    let result;

    describe('fetchProviders with an entityId/entityKey', () => {
      const saga = fetchProviders({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/providers?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [{ id: 1 }] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDERS_FULFILLED, payload: [{ id: 1 }] })
        );
      });
    });

    describe('fetchProviders without an entityId/entityKey', () => {
      const saga = fetchProviders({ fqon: 'iamfqon' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [{ id: 1 }] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDERS_FULFILLED, payload: [{ id: 1 }] })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchProviders({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_PROVIDERS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchProvidersByType Sequence', () => {
    let result;

    describe('fetchProvidersByType when there are providers', () => {
      const saga = fetchProvidersByType({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', providerType: 'chillout' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/providers?expand=true&type=chillout')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [{ id: 1 }] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDERS_BYTYPE_FULFILLED, payload: [{ id: 1 }] })
        );
      });
    });

    describe('fetchProvidersByType when there are NO providers', () => {
      const saga = fetchProvidersByType({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', providerType: 'chillout' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/providers?expand=true&type=chillout')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDERS_BYTYPE_FULFILLED, payload: [providerModel.get({ id: '', name: 'No Available Providers' })] })
        );
      });
    });

    describe('fetchProvidersByType without an entityId/entityKey', () => {
      const saga = fetchProvidersByType({ fqon: 'iamfqon', providerType: 'chillout' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers?expand=true&type=chillout')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDERS_BYTYPE_FULFILLED, payload: [providerModel.get({ id: '', name: 'No Available Providers' })] })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchProvidersByType({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_PROVIDERS_BYTYPE_REJECTED, payload: error })
      );
    });
  });

  describe('fetchExecutors Sequence', () => {
    let result;

    describe('fetchExecutors when there are providers', () => {
      const saga = fetchExecutors({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', executorType: 'chillout' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/providers?expand=true&type=chillout')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [{ id: 1, name: 'test', resource_type: 'TEST::NODEJS', properties: { config: { env: { public: { RUNTIME: 'nodejs' } } } } }] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_EXECUTORS_FULFILLED, payload: [{ name: 'test (NODEJS)', runtime: 'nodejs' }] })
        );
      });
    });

    describe('fetchExecutors when there are NO providers', () => {
      const saga = fetchExecutors({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', executorType: 'chillout' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/providers?expand=true&type=chillout')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_EXECUTORS_FULFILLED, payload: [{ id: '', name: 'No Available Executors' }] })
        );
      });
    });

    describe('fetchExecutors without an entityId/entityKey', () => {
      const saga = fetchExecutors({ fqon: 'iamfqon', executorType: 'chillout' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers?expand=true&type=chillout')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_EXECUTORS_FULFILLED, payload: [{ id: '', name: 'No Available Executors' }] })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchExecutors({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_EXECUTORS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchProvider Sequence', () => {
    let result;

    describe('fetchProvider with properties.linked_providers', () => {
      const saga = fetchProvider({ fqon: 'iamfqon', providerId: '1' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers/1')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { id: 1, properties: { linked_providers: [], config: { randomProp: 'shoudbehere' } } } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDER_FULFILLED, payload: { id: 1, properties: { linked_providers: [], config: { randomProp: 'shoudbehere', env: { public: {}, private: {} } } } } })
        );
      });
    });

    describe('fetchProvider with missing properties.linked_providers', () => {
      const saga = fetchProvider({ fqon: 'iamfqon', providerId: '1' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers/1')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { id: 1, properties: {} } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDER_FULFILLED, payload: { id: 1, properties: { linked_providers: [], config: { env: { public: {}, private: {} } } } } })
        );
      });
    });

    describe('fetchProvider with properties.config.env', () => {
      const saga = fetchProvider({ fqon: 'iamfqon', providerId: '1' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers/1')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { id: 1, properties: { config: { env: { public: {}, private: {} } }, linked_providers: [] } } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDER_FULFILLED, payload: { id: 1, properties: { config: { env: { public: {}, private: {} } }, linked_providers: [] } } })
        );
      });
    });

    describe('fetchProvider with missing properties.config.env', () => {
      const saga = fetchProvider({ fqon: 'iamfqon', providerId: '1' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/providers/1')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { id: 1, properties: { config: {}, linked_providers: [] } } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_PROVIDER_FULFILLED, payload: { id: 1, properties: { config: { env: { public: {}, private: {} } }, linked_providers: [] } } })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchProvider({ fqon: 'iamfqon', providerId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_PROVIDER_REJECTED, payload: error })
      );
    });
  });

  describe('createProvider Sequence', () => {
    let result;

    describe('createProvider with an entityId/entityKey', () => {
      const action = { fqon: 'iamfqon', entityId: '1', entityKey: 'environments', payload: { name: 'iamnewapi' } };
      const saga = createProvider(action);

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.post, 'iamfqon/environments/1/providers', action.payload)
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { id: 1 } });
        expect(result.value).to.deep.equal(
          put({ type: types.CREATE_PROVIDER_FULFILLED, payload: { id: 1 } })
        );
        // Finish the iteration
        result = saga.next();
      });
    });

    describe('createProvider without an entityId/entityKey', () => {
      const action = { fqon: 'iamfqon', payload: { name: 'iamnewapi' } };
      const saga = createProvider(action);

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.post, 'iamfqon/providers', action.payload)
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { id: 1 } });
        expect(result.value).to.deep.equal(
          put({ type: types.CREATE_PROVIDER_FULFILLED, payload: { id: 1 } })
        );
        // Finish the iteration
        result = saga.next();
      });
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { onSuccess: sinon.stub() };
      const sagaSuccess = createProvider(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createProvider({});
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_PROVIDER_REJECTED, payload: error })
      );
    });
  });

  describe('updateProvider Sequence', () => {
    const action = { fqon: 'iamfqon', providerId: '1', payload: [] };
    const saga = updateProvider(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, 'iamfqon/providers/1', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_PROVIDER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', providerId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateProvider(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateProvider(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_PROVIDER_REJECTED, payload: error })
      );
    });
  });

  describe('deleteProvider Sequence', () => {
    const action = { fqon: 'iamfqon', providerId: '1' };
    const saga = deleteProvider(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/providers/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_PROVIDER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteProvider(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteProvider(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_PROVIDER_REJECTED, payload: error })
      );
    });
  });

  describe('deleteProviders Sequence', () => {
    const action = { providerIds: ['1'], fqon: 'iamfqon' };
    const saga = deleteProviders(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.all, [axios.delete('iamfqon/providers/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_PROVIDERS_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteProviders(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteProviders(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_PROVIDERS_REJECTED, payload: error })
      );
    });
  });

  describe('redeployProvider Sequence', () => {
    const action = { fqon: 'iamfqon', providerId: '2' };
    const saga = redeployProvider(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/providers/2/redeploy')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.REDEPLOY_PROVIDER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = redeployProvider(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = redeployProvider(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.REDEPLOY_PROVIDER_REJECTED, payload: error })
      );
    });
  });

  describe('providerSagas', () => {
    let result;
    const rootSaga = providersagas();

    it('should fork a watcher for fetchProviders', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_PROVIDERS_REQUEST, fetchProviders)
      );
    });

    it('should fork a watcher for fetchProvidersByType', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_PROVIDERS_BYTYPE_REQUEST, fetchProvidersByType)
      );
    });

    it('should fork a watcher for fetchProviderKongsByGateway', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_PROVIDERS_KONG_GATEWAY_REQUEST, fetchProviderKongsByGateway)
      );
    });

    it('should fork a watcher for fetchExecutors', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_EXECUTORS_REQUEST, fetchExecutors)
      );
    });

    it('should fork a watcher for fetchProvider', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_PROVIDER_REQUEST, fetchProvider)
      );
    });

    it('should fork a watcher for createProvider', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_PROVIDER_REQUEST, createProvider)
      );
    });

    it('should fork a watcher for updateProvider', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_PROVIDER_REQUEST, updateProvider)
      );
    });

    it('should fork a watcher for deleteProvider', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_PROVIDER_REQUEST, deleteProvider)
      );
    });

    it('should fork a watcher for deleteProviders', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_PROVIDERS_REQUEST, deleteProviders)
      );
    });

    it('should fork a watcher for redeployProvider', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.REDEPLOY_PROVIDER_REQUEST, redeployProvider)
      );
    });
  });
});
