import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import syncSagas, {
  sync,
} from './sync';
import * as types from '../actionTypes';

describe('sync Sagas', () => {
  const error = 'an error has occured';
  const syncMock = [{ start: '' }];

  describe('sync Sequence', () => {
    const saga = sync();
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'sync')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: syncMock });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_SYNC_FULFILLED,
          payload: [{ start: '' }],
        })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = sync();
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_SYNC_REJECTED, payload: error })
      );
    });
  });

  describe('syncSagas', () => {
    let result;
    const rootSaga = syncSagas();

    it('should fork a watcher for sync', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_SYNC_REQUEST, sync)
      );
    });
  });
});
