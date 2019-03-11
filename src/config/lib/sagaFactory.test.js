import axios from 'axios';
import { call, put } from 'redux-saga/effects';
import { notificationActions } from 'Modules/Notifications';
import { PREFIX } from '../../constants';
import { fetchAPI } from './utility';
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
    const saga = fetchAll({ name: 'TESTS', entity: 'tests' })(payload);
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
      const sagaSuccess = fetchAll({ name: 'TESTS', entity: 'tests' })(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = fetchAll({ name: 'TESTS', entity: 'tests' })(errorPayload);
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
    const saga = fetchOne({ name: 'TEST', entity: 'tests' })(payload);
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
      const sagaSuccess = fetchOne({ name: 'TEST', entity: 'tests' })(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = fetchOne({ name: 'TEST', entity: 'tests' })(errorPayload);
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
    const saga = create({ name: 'TEST', entity: 'tests' })(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/environments/1/tests', { name: 'iamanewsaga' })
      );
    });

    it('should return a payload and dispatch a success status', () => {
      const resource = { data: { id: 1, name: 'test', resource_type: 'TEST::TESTY' } };
      result = saga.next(resource);

      expect(result.value).toEqual(
        put({ type: `${PREFIX}CREATE_TEST_FULFILLED`, payload: resource.data, updateState: false })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test TESTY created' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = create({ name: 'TEST', entity: 'tests' })(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });


    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = create({ name: 'TEST', entity: 'tests' })(errorPayload);
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
    const resource = { data: { id: 1, name: 'test', resource_type: 'TEST::TESTY' } };
    const saga = update({ name: 'TEST', entity: 'tests' })(payload);
    let result;

    it('should make an api call', () => {
      result = saga.next();

      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/tests/1', [])
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next(resource);

      expect(result.value).toEqual(
        put({ type: `${PREFIX}UPDATE_TEST_FULFILLED`, payload: resource.data, updateState: false })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test TESTY updated' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = update({ name: 'TEST', entity: 'tests' })(successPayload);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      sagaSuccess.next();

      expect(successPayload.onSuccess).toBeCalledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { onError: jest.fn() };
      const sagaError = update({ name: 'TEST', entity: 'tests' })(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}UPDATE_TEST_REJECTED`, payload: error })
      );
    });
  });

  describe('deleteOne Sequence', () => {
    const resource = { id: '1', name: 'test', resource_type: 'TEST::TESTY' };
    const payload = { fqon: 'iamfqon', resource };
    const saga = deleteOne({ name: 'TEST', entity: 'tests' })(payload);
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
        put({ type: `${PREFIX}DELETE_TEST_FULFILLED`, payload: resource })
      );
    });

    it('should dispatch a notification', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(notificationActions.addNotification({ message: 'test TESTY deleted' }))
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = deleteOne({ name: 'TEST', entity: 'tests' })(successPayload);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();

      expect(successPayload.onSuccess).toHaveBeenCalled();
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const errorPayload = { ...payload, onError: jest.fn() };
      const sagaError = deleteOne({ name: 'TEST', entity: 'tests' })(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}DELETE_TEST_REJECTED`, payload: error })
      );
    });
  });

  describe('deleteMany Sequence', () => {
    const resource = { id: '1', name: 'test', resource_type: 'TEST::TESTY' };
    const payload = { resources: [resource], fqon: 'iamfqon' };
    const saga = deleteMany({ name: 'TESTS', entity: 'tests' })(payload);
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
        put({ type: `${PREFIX}DELETE_TESTS_FULFILLED`, payload: [resource] })
      );
    });

    it('should return a response when onSuccess callback is passed', () => {
      const successPayload = { ...payload, onSuccess: jest.fn() };
      const sagaSuccess = deleteMany({ name: 'TESTS', entity: 'tests' })(successPayload);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();

      expect(successPayload.onSuccess).toHaveBeenCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const errorPayload = { ...payload, onError: jest.fn() };
      const sagaError = deleteMany({ name: 'TESTS', entity: 'tests' })(errorPayload);
      let resultError = sagaError.next();
      resultError = sagaError.throw(error);

      expect(errorPayload.onError).toBeCalledWith(error);
      expect(resultError.value).toEqual(
        put({ type: `${PREFIX}DELETE_TESTS_REJECTED`, payload: error })
      );
    });
  });
});
