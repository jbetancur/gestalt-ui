import axios from 'axios';
import { call, put } from 'redux-saga/effects';
import { fetchAPI } from '../lib/utility';
import { PREFIX } from '../actionTypes';
import {
  fetchAll,
  fetchOne,
  create,
  update,
  deleteOne,
  deleteMany,
} from './sagaFactory';

describe('Saga Factory', () => {
  const error = 'an error has occured';

  describe('fetchAll Sequence', () => {
    const payload = { fqon: 'iamfqon', entityId: '1', entityKey: 'environments' };
    const saga = fetchAll('TESTS', 'tests')(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(fetchAPI, 'iamfqon/environments/1/tests?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });

      expect(result.value).toEqual(
        put({ type: `${PREFIX}FETCH_TESTS_FULFILLED`, payload: [{ id: 1 }] })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = fetchAll('TESTS', 'tests')(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = fetchAll('TESTS', 'tests')(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}FETCH_TESTS_REJECTED`, payload: error })
      );
    });
  });

  describe('fetchOne Sequence', () => {
    const payload = { fqon: 'iamfqon', id: '1' };
    const saga = fetchOne('TEST', 'tests')(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(fetchAPI, 'iamfqon/tests/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).toEqual(
        put({ type: `${PREFIX}FETCH_TEST_FULFILLED`, payload: { id: 1 } })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = fetchOne('TEST', 'tests')(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = fetchOne('TEST', 'tests')(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}FETCH_TEST_REJECTED`, payload: error })
      );
    });
  });

  describe('create Sequence', () => {
    const payload = { fqon: 'iamfqon', entityId: '1', entityKey: 'environments', payload: { name: 'iamanewsaga' } };
    const saga = create('TEST', 'tests')(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/environments/1/tests', { name: 'iamanewsaga' })
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).toEqual(
        put({ type: `${PREFIX}CREATE_TEST_FULFILLED`, payload: { id: 1 } })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = create('TEST', 'tests')(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = create('TEST', 'tests')(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}CREATE_TEST_REJECTED`, payload: error })
      );
    });
  });

  describe('update Sequence', () => {
    const payload = { fqon: 'iamfqon', id: '1', payload: [] };
    const saga = update('TEST', 'tests')(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/tests/1', [])
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).toEqual(
        put({ type: `${PREFIX}UPDATE_TEST_FULFILLED`, payload: { id: 1 } })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = update('TEST', 'tests')(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = update('TEST', 'tests')(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}UPDATE_TEST_REJECTED`, payload: error })
      );
    });
  });

  describe('deleteOne Sequence', () => {
    const payload = { fqon: 'iamfqon', id: '1' };
    const saga = deleteOne('TEST', 'tests')(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/tests/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put({ type: `${PREFIX}DELETE_TEST_FULFILLED`, payload: '1' })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = deleteOne('TEST', 'tests')(successPayload);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();

      expect(successPayload.onSuccess).toHaveBeenCalled();
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = deleteOne('TEST', 'tests')(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}DELETE_TEST_REJECTED`, payload: error })
      );
    });
  });

  describe('deleteMany Sequence', () => {
    const payload = { ids: ['1'], fqon: 'iamfqon' };
    const saga = deleteMany('TESTS', 'tests')(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.all, [axios.delete('iamfqon/tests/1')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put({ type: `${PREFIX}DELETE_TESTS_FULFILLED` })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = deleteMany('TESTS', 'tests')(successPayload);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();

      expect(successPayload.onSuccess).toHaveBeenCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const errorPayload = { ...payload, onError: jest.fn() };
      const sagaError = deleteMany('TESTS', 'tests')(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}DELETE_TESTS_REJECTED`, payload: error })
      );
    });
  });
});
