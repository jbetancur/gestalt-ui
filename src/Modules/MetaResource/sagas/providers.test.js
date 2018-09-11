import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import providersagas, {
  redeployProvider,
} from './providers';
import * as types from '../actionTypes';

describe('Provider Sagas', () => {
  const error = 'an error has occured';

  describe('redeployProvider Sequence', () => {
    const action = { fqon: 'iamfqon', id: '2' };
    const saga = redeployProvider(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/providers/2/redeploy')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.REDEPLOY_PROVIDER_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = redeployProvider(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = redeployProvider(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.REDEPLOY_PROVIDER_REJECTED, payload: error })
      );
    });
  });

  describe('providerSagas', () => {
    let result;
    const rootSaga = providersagas();

    it('should fork a watcher for redeployProvider', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.REDEPLOY_PROVIDER_REQUEST, redeployProvider)
      );
    });
  });
});
