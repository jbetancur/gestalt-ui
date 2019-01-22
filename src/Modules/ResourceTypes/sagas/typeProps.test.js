import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import typepropertiesagas, {
  createTypeProperty,
  updateTypeProperty,
  deleteTypeProperty,
  batchUpdateTypeProperties,
} from './typeProps';
import {
  CREATE_TYPEPROPERTY_REQUEST,
  CREATE_TYPEPROPERTY_FULFILLED,
  CREATE_TYPEPROPERTY_REJECTED,
  UPDATE_TYPEPROPERTY_REQUEST,
  UPDATE_TYPEPROPERTY_FULFILLED,
  UPDATE_TYPEPROPERTY_REJECTED,
  DELETE_TYPEPROPERTY_REQUEST,
  DELETE_TYPEPROPERTY_FULFILLED,
  DELETE_TYPEPROPERTY_REJECTED,
  BATCH_UPDATE_TYPEPROPERTY_REQUEST,
  BATCH_UPDATE_TYPEPROPERTY_FULFILLED,
  BATCH_UPDATE_TYPEPROPERTY_REJECTED,
} from '../constants';

describe('TypeProperty Sagas', () => {
  const error = 'an error has occured';

  describe('createTypeProperty Sequence', () => {
    const action = { fqon: 'iamfqon', resourceTypeId: '1', payload: { name: 'iamnewtypeprop' } };
    const saga = createTypeProperty(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/resourcetypes/1/typeproperties', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: CREATE_TYPEPROPERTY_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', payload: { name: 'iamnewtypeprop' }, onSuccess: jest.fn() };
      const sagaSuccess = createTypeProperty(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createTypeProperty(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: CREATE_TYPEPROPERTY_REJECTED, payload: error })
      );
    });
  });

  describe('updateTypeProperty Sequence', () => {
    const action = { fqon: 'iamfqon', typePropertyId: '1', payload: [] };
    const saga = updateTypeProperty(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/typeproperties/1', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: UPDATE_TYPEPROPERTY_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', typePropertyId: '1', payload: [], onSuccess: jest.fn() };
      const sagaSuccess = updateTypeProperty(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateTypeProperty(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: UPDATE_TYPEPROPERTY_REJECTED, payload: error })
      );
    });
  });

  describe('deleteTypeProperty Sequence', () => {
    const action = { fqon: 'iamfqon', typePropertyId: '1' };
    const saga = deleteTypeProperty(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/typeproperties/1')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: DELETE_TYPEPROPERTY_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = deleteTypeProperty(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteTypeProperty(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: DELETE_TYPEPROPERTY_REJECTED, payload: error })
      );
    });
  });

  describe('batchUpdateTypeProperties Sequence', () => {
    describe('batchUpdateTypeProperties PATCHOPS', () => {
      it('should make an api call and return dispatch a success status with', () => {
        const patches = [{ op: 'replace', path: '/name', value: 'test' }];
        const operations = [{ op: 'PATCH', id: '1', patches }];
        const action = { fqon: 'iamfqon', operations };
        const saga = batchUpdateTypeProperties(action);
        let result = saga.next();

        expect(result.value).toEqual(
          call(updateTypeProperty, { fqon: 'iamfqon', typePropertyId: '1', payload: patches })
        );

        result = saga.next();
        expect(result.value).toEqual(
          put({ type: BATCH_UPDATE_TYPEPROPERTY_FULFILLED })
        );

        // Finish the iteration
        result = saga.next();
      });
    });

    describe('batchUpdateTypeProperties NO PATCHOPS', () => {
      it('should make an api call and return dispatch a success status with', () => {
        const operations = [{ op: 'PATCH', id: '1', patches: [] }];
        const action = { fqon: 'iamfqon', operations };
        const saga = batchUpdateTypeProperties(action);
        let result = saga.next();

        expect(result.value).toEqual(
          put({ type: BATCH_UPDATE_TYPEPROPERTY_FULFILLED })
        );

        // Finish the iteration
        result = saga.next();
      });
    });

    describe('batchUpdateTypeProperties POST', () => {
      it('should make an api call and return dispatch a success status with', () => {
        const operations = [{ op: 'POST', resourceTypeId: '1', payload: { name: 'test' } }];
        const action = { fqon: 'iamfqon', operations };
        const saga = batchUpdateTypeProperties(action);
        let result = saga.next();

        expect(result.value).toEqual(
          call(createTypeProperty, { fqon: 'iamfqon', resourceTypeId: '1', payload: { name: 'test' } })
        );

        result = saga.next();
        expect(result.value).toEqual(
          put({ type: BATCH_UPDATE_TYPEPROPERTY_FULFILLED })
        );

        // Finish the iteration
        result = saga.next();
      });
    });

    describe('batchUpdateTypeProperties DELETE', () => {
      it('should make an api call and return dispatch a success status with', () => {
        const operations = [{ op: 'DELETE', id: '1' }];
        const action = { fqon: 'iamfqon', operations };
        const saga = batchUpdateTypeProperties(action);
        let result = saga.next();

        expect(result.value).toEqual(
          call(deleteTypeProperty, { fqon: 'iamfqon', typePropertyId: '1' })
        );

        result = saga.next();
        expect(result.value).toEqual(
          put({ type: BATCH_UPDATE_TYPEPROPERTY_FULFILLED })
        );

        // Finish the iteration
        result = saga.next();
      });
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', operations: [], onSuccess: jest.fn() };
      const sagaSuccess = batchUpdateTypeProperties(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = batchUpdateTypeProperties({ fqon: 'iamfqon', operations: [] });
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: BATCH_UPDATE_TYPEPROPERTY_REJECTED, payload: error })
      );
    });
  });

  describe('typepropertiesagas', () => {
    let result;
    const rootSaga = typepropertiesagas();

    it('should fork a watcher for createTypeProperty', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(CREATE_TYPEPROPERTY_REQUEST, createTypeProperty)
      );
    });

    it('should fork a watcher for updateTypeProperty', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(UPDATE_TYPEPROPERTY_REQUEST, updateTypeProperty)
      );
    });

    it('should fork a watcher for deleteTypeProperty', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(DELETE_TYPEPROPERTY_REQUEST, deleteTypeProperty)
      );
    });

    it('should fork a watcher for batchUpdateTypeProperties', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(BATCH_UPDATE_TYPEPROPERTY_REQUEST, batchUpdateTypeProperties)
      );
    });
  });
});
