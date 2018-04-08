import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import searchSagas, {
  doSearch,
} from './search';
import * as types from '../actionTypes';

describe('Search Sagas', () => {
  const error = 'an error has occured';
  const searchMock = [{ id: '1', name: 'morty' }];
  const action = { fqon: 'iamfqon', entity: 'users', value: 'morty', field: 'name' };

  describe('doSearch Sequence', () => {
    const saga = doSearch(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/users/search?name=morty')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: searchMock });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_SEARCH_FULFILLED,
          payload: [{ id: '1', name: 'morty' }],
        })
      );
    });

    it('should return a the default field "name" when no field is provided', () => {
      const actionNoName = { ...action, field: '' };
      const sagaSuccess = doSearch(actionNoName);
      sagaSuccess.next();
      sagaSuccess.next({ data: searchMock });
      sagaSuccess.next();
      expect(result.value).toEqual(
        put({
          type: types.FETCH_SEARCH_FULFILLED,
          payload: [{ id: '1', name: 'morty' }],
        })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = doSearch(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: searchMock });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith(searchMock);
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = doSearch({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_SEARCH_REJECTED, payload: error })
      );
    });
  });

  describe('searchSagas', () => {
    let result;
    const rootSaga = searchSagas();

    it('should fork a watcher for doSearch', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_SEARCH_REQUEST, doSearch)
      );
    });
  });
});
