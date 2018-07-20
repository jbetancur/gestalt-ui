import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import searchSagas, {
  searchUser,
  searchAsset,
} from './search';
import * as types from '../actionTypes';

describe('Search Sagas', () => {
  describe('searchUser Sequence', () => {
    const error = 'an error has occured';
    const searchMock = [{ id: '1', name: 'morty' }];
    const action = { entity: 'users', value: 'morty', field: 'name' };
    const saga = searchUser(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'root/users/search?name=morty')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: searchMock });
      expect(result.value).toEqual(
        put({
          type: types.DO_SEARCHUSERS_FULFILLED,
          payload: [{ id: '1', name: 'morty' }],
        })
      );
    });

    it('should return a the default field "name" when no field is provided', () => {
      const actionNoName = { ...action, field: '' };
      const sagaSuccess = searchUser(actionNoName);
      sagaSuccess.next();
      sagaSuccess.next({ data: searchMock });
      sagaSuccess.next();
      expect(result.value).toEqual(
        put({
          type: types.DO_SEARCHUSERS_FULFILLED,
          payload: [{ id: '1', name: 'morty' }],
        })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = searchUser(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: searchMock });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith(searchMock);
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = searchUser({});
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DO_SEARCHUSERS_REJECTED, payload: error })
      );
    });
  });

  describe('searchAsset Sequence', () => {
    const error = 'an error has occured';
    const searchMock = [{ id: '1', name: 'morty' }];
    const action = { entity: 'users', value: 'morty' };
    const saga = searchAsset(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'users/search?name=morty')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: searchMock });
      expect(result.value).toEqual(
        put({
          type: types.DO_SEARCHASSETS_FULFILLED,
          payload: [{ id: '1', name: 'morty' }],
        })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = searchAsset(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: searchMock });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith(searchMock);
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = searchAsset({});
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DO_SEARCHASSETS_REJECTED, payload: error })
      );
    });
  });


  describe('searchSagas', () => {
    let result;
    const rootSaga = searchSagas();

    it('should fork a watcher for searchUser', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DO_SEARCHUSERS_REQUEST, searchUser)
      );
    });

    it('should fork a watcher for searchAsset', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DO_SEARCHASSETS_REQUEST, searchAsset)
      );
    });
  });
});
