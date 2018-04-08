import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import actionsSagas, {
  fetchActions,
  fetchContextActions,
} from './actions';
import * as types from '../actionTypes';

describe('Action Sagas', () => {
  describe('fetchActions Sequence with filters', () => {
    const saga = fetchActions({ fqon: 'iamfqon', entityId: '1', entityKey: 'workspaces', filters: { filter: ['workspace.list', 'workspace.detail'] } });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/workspaces/1/actions?expand=true&compact=false&filter=workspace.list&filter=workspace.detail')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1, properties: { } }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_ACTIONS_FULFILLED,
          payload: [
            { id: 1, properties: { } }]
        })
      );
    });
  });

  describe('fetchActions Sequence without filters', () => {
    const saga = fetchActions({ fqon: 'iamfqon', entityId: '1', entityKey: 'workspaces' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/workspaces/1/actions?expand=true&compact=false')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1, properties: { } }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_ACTIONS_FULFILLED,
          payload: [
            { id: 1, properties: { } }]
        })
      );
    });
  });

  describe('fetchActions Sequence without an entityKey', () => {
    const saga = fetchActions({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/actions?expand=true&compact=false')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1, properties: { } }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_ACTIONS_FULFILLED,
          payload: [
            { id: 1, properties: { } }]
        })
      );
    });
  });

  describe('fetchActions Errors', () => {
    const error = 'an error has occured';

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchActions({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_ACTIONS_REJECTED, payload: error })
      );
    });
  });


  describe('fetchContextActions Sequence with filters', () => {
    const saga = fetchContextActions({ fqon: 'iamfqon', entityId: '1', entityKey: 'workspaces', filters: { filter: ['workspace.list', 'workspace.detail'] } });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/workspaces/1/actions?expand=true&compact=false&filter=workspace.list&filter=workspace.detail')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1, properties: { } }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_CONTEXT_ACTIONS_FULFILLED,
          payload: [
            { id: 1, properties: { } }]
        })
      );
    });
  });

  describe('fetchContextActions Sequence without filters', () => {
    const saga = fetchContextActions({ fqon: 'iamfqon', entityId: '1', entityKey: 'workspaces' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/workspaces/1/actions?expand=true&compact=false')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1, properties: { } }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_CONTEXT_ACTIONS_FULFILLED,
          payload: [
            { id: 1, properties: { } }]
        })
      );
    });
  });

  describe('fetchContextActions Sequence without an entityKey', () => {
    const saga = fetchContextActions({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/actions?expand=true&compact=false')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1, properties: { } }] });
      expect(result.value).toEqual(
        put({
          type: types.FETCH_CONTEXT_ACTIONS_FULFILLED,
          payload: [
            { id: 1, properties: { } }]
        })
      );
    });
  });

  describe('fetchContextActions Errors', () => {
    const error = 'an error has occured';

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchContextActions({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_CONTEXT_ACTIONS_REJECTED, payload: error })
      );
    });
  });

  describe('actionsSagas', () => {
    let result;
    const rootSaga = actionsSagas();

    it('should fork a watcher for fetchActions', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_ACTIONS_REQUEST, fetchActions)
      );
    });

    it('should fork a watcher for fetchContextActions', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_CONTEXT_ACTIONS_REQUEST, fetchContextActions)
      );
    });
  });
});

