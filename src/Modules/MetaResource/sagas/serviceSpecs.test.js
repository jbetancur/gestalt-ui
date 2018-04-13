import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import serviceSagas, {
  fetchServiceSpecs,
  createServiceSpec,
} from './serviceSpecs';
import * as types from '../actionTypes';

describe('ServiceSpec Sagas', () => {
  const error = 'an error has occured';

  describe('fetchServiceSpecs Sequence', () => {
    const saga = fetchServiceSpecs({ fqon: 'iamfqon' });
    let result;

    it('should make an ServiceSpec call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/servicespecs?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).toEqual(
        put({ type: types.FETCH_SERVICESPECS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchServiceSpecs({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_SERVICESPECS_REJECTED, payload: error })
      );
    });
  });

  describe('createServiceSpec Sequence', () => {
    const action = { fqon: 'iamfqon', payload: { name: 'iamnewServiceSpec' } };
    const saga = createServiceSpec(action);
    let result;

    it('should make an ServiceSpec call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/servicespecs', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.CREATE_SERVICESPEC_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createServiceSpec(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createServiceSpec(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.CREATE_SERVICESPEC_REJECTED, payload: error })
      );
    });
  });

  describe('ServiceSpec Sagas', () => {
    let result;
    const rootSaga = serviceSagas();

    it('should fork a watcher for fetchServiceSpecs', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_SERVICESPECS_REQUEST, fetchServiceSpecs)
      );
    });

    it('should fork a watcher for createServiceSpec', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.CREATE_SERVICESPEC_REQUEST, createServiceSpec)
      );
    });
  });
});
