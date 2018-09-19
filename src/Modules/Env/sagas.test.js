import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import envSagas, {
  fetchEnv,
  fetchEnvSchema,
} from './sagas';
import {
  FETCH_ENV_REQUEST,
  FETCH_ENV_FULFILLED,
  FETCH_ENV_REJECTED,
  FETCH_ENVSCHEMA_REQUEST,
  FETCH_ENVSCHEMA_FULFILLED,
  FETCH_ENVSCHEMA_REJECTED,
} from './constants';

describe('Env Sagas', () => {
  const error = 'an error has occured';

  describe('fetchEnv Sequence', () => {
    let result;

    describe('fetchEnv with an entityId/entityKey', () => {
      const saga = fetchEnv({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/environments/1/env')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { var: 'test' } });
        expect(result.value).toEqual(
          put({ type: FETCH_ENV_FULFILLED, payload: { var: 'test' } })
        );
      });
    });

    describe('fetchEnv without an entityId/entityKey', () => {
      const saga = fetchEnv({ fqon: 'iamfqon' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.get, 'iamfqon/env')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { var: 'test' } });
        expect(result.value).toEqual(
          put({ type: FETCH_ENV_FULFILLED, payload: { var: 'test' } })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnv({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_ENV_REJECTED, payload: error })
      );
    });
  });

  describe('fetchEnvSchema Sequence', () => {
    let result;
    const saga = fetchEnvSchema({ fqon: 'root', id: '25acb32c-6635-49d1-ba19-4cf317003ff6' });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'root/resourcetypes/25acb32c-6635-49d1-ba19-4cf317003ff6/schema?filter=config')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ name: 'PUBLIC', value: 'yup', public: true }, { name: 'PRIVATE', value: 'nope', public: false }] });
      expect(result.value).toEqual(
        put({ type: FETCH_ENVSCHEMA_FULFILLED, payload: { public: [{ name: 'PUBLIC', value: 'yup', public: true }], private: [{ name: 'PRIVATE', value: 'nope', public: false }] } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnvSchema({ schemaType: 'KONG' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_ENVSCHEMA_REJECTED, payload: error })
      );
    });
  });

  describe('envSagas', () => {
    let result;
    const rootSaga = envSagas();

    it('should fork a watcher for fetchEnv', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, FETCH_ENV_REQUEST, fetchEnv)
      );
    });

    it('should fork a watcher for fetchEnvSchema', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, FETCH_ENVSCHEMA_REQUEST, fetchEnvSchema)
      );
    });
  });
});
