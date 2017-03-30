import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import envSagas, {
  fetchEnv,
} from './env';
import * as types from '../actionTypes';

describe('API Sagas', () => {
  const error = 'an error has occured';

  describe('fetchEnv Sequence', () => {
    let result;

    describe('fetchEnv with an entityId/entityKey', () => {
      const saga = fetchEnv({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/env')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { var: 'test' } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENV_FULFILLED, payload: { var: 'test' } })
        );
      });
    });

    describe('fetchEnv without an entityId/entityKey', () => {
      const saga = fetchEnv({ fqon: 'iamfqon' });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/env')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: { var: 'test' } });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENV_FULFILLED, payload: { var: 'test' } })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEnv({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENV_REJECTED, payload: error })
      );
    });
  });

  describe('envSagas', () => {
    let result;
    const rootSaga = envSagas();

    it('should fork a watcher for fetchEnv', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_ENV_REQUEST, fetchEnv)
      );
    });
  });
});
