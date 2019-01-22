import { call, put, fork, takeLatest } from 'redux-saga/effects';
import { merge } from 'lodash';
import { fetchAPI } from 'config/lib/utility';
import loggingSagas, {
  fetchLogProvider,
} from './sagas';
import { LOGGING } from '../../constants'; // TODO: mock up with rewire
import {
  FETCH_LOGPROVIDER_REQUEST,
  FETCH_LOGPROVIDER_FULFILLED,
  FETCH_LOGPROVIDER_REJECTED,
} from './constants';

const genericMock = Object.freeze({
  data: {
    properties: {
      config: {
        env: {
          public: {},
          private: {},
        }
      }
    }
  }
});

describe('Logging Sagas', () => {
  const error = 'an error has occured';

  describe('fetchLogProvider Sequence', () => {
    let result;

    describe('fetchLogProvider with a logType of "container"', () => {
      const saga = fetchLogProvider({ fqon: 'iamfqon', providerId: '1', logType: 'container' });
      it('should make an api call for the "CAAS" provider', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/providers/1')
        );
      });

      it('should make an api call for the "Logging" provider', () => {
        const caasProviderResponse = { data: { id: '1', properties: { linked_providers: [{ id: '2', typeId: LOGGING }] } } };
        result = saga.next(caasProviderResponse);
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/providers/2')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const logProviderResponse = merge(genericMock, { data: { id: '1', properties: { config: { env: { public: { SERVICE_VHOST_0: 'whatever' } } } } } });
        result = saga.next(logProviderResponse);

        const payload = {
          provider: logProviderResponse.data,
          url: 'https://whatever/container',
        };

        expect(result.value).toEqual(
          put({ type: FETCH_LOGPROVIDER_FULFILLED, payload })
        );
      });
    });

    describe('fetchLogProvider with a logType of "container" when there is the optional SERVICE_VHOST_0_PROTOCOL', () => {
      const saga = fetchLogProvider({ fqon: 'iamfqon', providerId: '1', logType: 'container' });

      it('should return a payload and dispatch a success status', () => {
        const logProviderResponse = merge(genericMock, { data: { id: '1', properties: { config: { env: { public: { SERVICE_VHOST_0: 'whatever', SERVICE_VHOST_0_PROTOCOL: 'poopy' } } } } } });
        result = saga.next();
        result = saga.next({ data: { id: '1', properties: { linked_providers: [{ id: '2', typeId: LOGGING }] } } });
        result = saga.next(logProviderResponse);

        const payload = {
          provider: logProviderResponse.data,
          url: 'poopy://whatever/container',
        };

        expect(result.value).toEqual(
          put({ type: FETCH_LOGPROVIDER_FULFILLED, payload })
        );
      });
    });

    describe('fetchLogProvider with a a logType of "lambda"', () => {
      const saga = fetchLogProvider({ fqon: 'iamfqon', providerId: '1', logType: 'lambda' });
      it('should make an api call for the "Lambda" provider', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/providers/1')
        );
      });

      it('should make an api call for the "META_COMPUTE_PROVIDER_ID" provider', () => {
        const providerResponse = merge(genericMock, { data: { id: '1', properties: { config: { env: { public: { META_COMPUTE_PROVIDER_ID: '123' } } } } } });

        result = saga.next(providerResponse);
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/providers/123')
        );
      });

      it('should make an api call for the "Logging" provider', () => {
        const caasProviderResponse = merge(genericMock, { data: { id: '1', properties: { linked_providers: [{ id: '2', typeId: LOGGING }] } } });
        result = saga.next(caasProviderResponse);
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/providers/2')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const logProviderResponse = { data: { id: '1', properties: { config: { env: { public: { SERVICE_VHOST_0: 'whatever' } } } } } };
        result = saga.next(logProviderResponse);
        const payload = {
          provider: logProviderResponse.data,
          url: 'https://whatever/lambda',
        };

        expect(result.value).toEqual(
          put({ type: FETCH_LOGPROVIDER_FULFILLED, payload })
        );
      });
    });

    describe('fetchLogProvider Sequence is missing PUBLIC vars', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaMissingPUBLIC = fetchLogProvider({ fqon: 'iamfqon', providerId: '1', logType: 'container' });
        const logProviderResponse = { data: { id: '1', properties: { config: { env: { public: {} } } } } };
        const cassProviderResponse = { data: { id: '1', properties: { linked_providers: [{ id: '2', typeId: LOGGING }] } } };
        result = sagaMissingPUBLIC.next();
        result = sagaMissingPUBLIC.next(cassProviderResponse);
        result = sagaMissingPUBLIC.next(logProviderResponse);
        const payload = {
          provider: logProviderResponse.data,
          url: '',
        };

        expect(result.value).toEqual(
          put({ type: FETCH_LOGPROVIDER_FULFILLED, payload })
        );
      });
    });

    describe('fetchLogProvider Sequence is REJECTED', () => {
      describe('when there is no Logging Provider defined', () => {
        const saga = fetchLogProvider({ fqon: 'iamfqon', providerId: '1', logType: 'container' });

        it('should REJECT fetchLogProvider', () => {
          const caasProviderResponse = { data: { id: '1', name: 'poopy', properties: { linked_providers: [] } } };
          result = saga.next();
          result = saga.next(caasProviderResponse);
          expect(result.value).toEqual(
            put({ type: FETCH_LOGPROVIDER_REJECTED, payload: 'A Logging Provided does not appear to be Linked to poopy' })
          );
        });
      });

      describe('when there is an exception', () => {
        it('should return a payload and dispatch a reject status when there is an error', () => {
          const sagaError = fetchLogProvider({ fqon: 'iamfqon', providerId: '1', logType: 'container' });
          let resultError = sagaError.next();
          resultError = sagaError.throw({ message: error });

          expect(resultError.value).toEqual(
            put({ type: FETCH_LOGPROVIDER_REJECTED, payload: error })
          );
        });
      });
    });
  });

  describe('loggingSagas', () => {
    let result;
    const rootSaga = loggingSagas();

    it('should fork a watcher for fetchLogProvider', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(FETCH_LOGPROVIDER_REQUEST, fetchLogProvider)
      );
    });
  });
});
