import axios from 'axios';
import Cookies from 'universal-cookie';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import { getItem, saveItem } from 'util/helpers/localstorage';
import authSagas, {
  login,
  logout,
  setToken,
} from './sagas';
import * as types from './actionTypes';

describe('Auth Sagas', () => {
  const tokenData = { access_token: '321', expires_in: '2018-07-10T06:57:27.000Z' };

  describe('login Sequence', () => {
    const action = { username: 'luke', password: 'iamyourfather' };
    const saga = login(action);
    let result;

    it('should make an api call to request a token', () => {
      result = saga.next();

      expect(result.value.CALL.args).toEqual(
        call(axios.post, 'root/oauth/issue', 'grant_type=password&username=luke&password=iamyourfather').CALL.args
      );
    });

    it('should save the auth token to a cookie', () => {
      result = saga.next({ data: tokenData });

      expect(result.value).toEqual(
        call(setToken, tokenData)
      );
    });

    it('should trigget a sync', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.post, 'sync')
      );
    });

    it('should put the correct message when fulfilled', () => {
      result = saga.next({ data: tokenData });

      expect(result.value).toEqual(
        put({ type: types.AUTH_TOKEN_FULFILLED, payload: tokenData })
      );
    });

    describe('when onSuccess callback is specificed', () => {
      it('should return a response when onSuccess callback is passed', () => {
        const onSuccessAction = { ...action, onSuccess: jest.fn() };
        const sagaSuccess = login(onSuccessAction);
        sagaSuccess.next();
        sagaSuccess.next({ data: tokenData });
        sagaSuccess.next();
        sagaSuccess.next();
        sagaSuccess.next();
        sagaSuccess.next();
        sagaSuccess.next();

        expect(onSuccessAction.onSuccess).toHaveBeenCalled();
      });
    });

    describe('when there are rejections', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const error = 'an error has occured';
        const sagaError = login(action);
        let resultError = sagaError.next();

        resultError = sagaError.throw({ error });

        expect(resultError.value).toEqual(
          put({ type: types.AUTH_TOKEN_REJECTED, payload: { error } })
        );
      });
    });
  });

  describe('logout Sequence', () => {
    let cookies;

    beforeEach(() => {
      cookies = new Cookies();
      cookies.set('auth_token', '123', { path: '/' });
      saveItem('lastVisitedRoute', '/test');
    });

    describe('when there is a valid token to delete', () => {
      const action = { preserveLastVisitedRoute: false };
      const saga = logout(action);
      let result;

      it('should make an api call', () => {
        result = saga.next();

        expect(result.value.CALL.args).toEqual(
          call(axios.delete, 'accessTokens/123').CALL.args
        );
      });

      it('should clean up cookies/localstorage when done', () => {
        result = saga.next();
        result = saga.next();

        expect(cookies.get('auth_token')).toBeUndefined();
        expect(getItem('lastVisitedRoute')).toBeNull();
      });
    });

    describe('when there is NO token to delete is should not attempt to delete it', () => {
      const action = {};
      const saga = logout(action);

      it('should clean up cookies/localstorage when done', () => {
        cookies.remove('auth_token', '123', { path: '/' });
        saga.next();
        saga.next();

        expect(cookies.get('auth_token')).toBeUndefined();
        expect(getItem('lastVisitedRoute')).toBeNull();
      });
    });

    describe('when preserveLastVisitedRoute is true', () => {
      const action = { preserveLastVisitedRoute: true };
      const saga = logout(action);

      it('should clean up cookies/localstorage when done', () => {
        saga.next();
        saga.next();
        saga.next();

        expect(getItem('lastVisitedRoute')).toBe('/test');
      });
    });

    describe('when preserveLastVisitedRoute is false', () => {
      const action = {};
      const saga = logout(action);

      it('should clean up cookies/localstorage when done', () => {
        saga.next();
        saga.next();
        saga.next();

        expect(getItem('lastVisitedRoute')).toBeNull();
      });
    });

    describe('when onSuccess callback is specificed', () => {
      it('should return a response when onSuccess callback is passed', () => {
        const onSuccessAction = { onSuccess: jest.fn() };
        const sagaSuccess = logout(onSuccessAction);
        sagaSuccess.next();
        sagaSuccess.next();
        sagaSuccess.next();

        expect(onSuccessAction.onSuccess).toHaveBeenCalled();
      });
    });

    describe('when there are rejections', () => {
      it('should return a payload and dispatch a zreject status when there is an error', () => {
        const error = 'an error has occured';
        const sagaError = logout();
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: types.LOGOUT_REJECTED, payload: error })
        );
      });
    });
  });

  describe('authSagas', () => {
    let result;
    const rootSaga = authSagas();

    it('should fork a watcher for login', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.AUTH_TOKEN_REQUEST, login)
      );
    });

    it('should fork a watcher for logout', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.LOGOUT_REQUEST, logout)
      );
    });
  });
});
