import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import policySagas, {
  fetchPolicies,
  fetchPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  deletePolicies,
} from './policies';
import * as types from '../actionTypes';

describe('Policy Sagas', () => {
  const error = 'an error has occured';

  describe('fetchPolicies Sequence', () => {
    const saga = fetchPolicies({ fqon: 'iamfqon', environmentId: '1' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/environments/1/policies?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).toEqual(
        put({ type: types.FETCH_POLICIES_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchPolicies({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_POLICIES_REJECTED, payload: error })
      );
    });
  });

  describe('fetchPolicy Sequence', () => {
    const saga = fetchPolicy({ fqon: 'iamfqon', policyId: '1' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/policies/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).toEqual(
        put({ type: types.FETCH_POLICY_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchPolicy({ fqon: 'iamfqon', policyId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.FETCH_POLICY_REJECTED, payload: error })
      );
    });
  });

  describe('createPolicy Sequence', () => {
    const action = { fqon: 'iamfqon', environmentId: '1', payload: { name: 'iamnewapi' } };
    const saga = createPolicy(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.post, 'iamfqon/environments/1/policies', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.CREATE_POLICY_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createPolicy(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createPolicy(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.CREATE_POLICY_REJECTED, payload: error })
      );
    });
  });

  describe('updatePolicy Sequence', () => {
    const action = { fqon: 'iamfqon', policyId: '1', payload: [] };
    const saga = updatePolicy(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/policies/1', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: types.UPDATE_POLICY_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', policyId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updatePolicy(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updatePolicy(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: types.UPDATE_POLICY_REJECTED, payload: error })
      );
    });
  });

  describe('deletePolicy Sequence', () => {
    const action = { fqon: 'iamfqon', policyId: '1' };
    const saga = deletePolicy(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/policies/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_POLICY_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deletePolicy(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deletePolicy(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_POLICY_REJECTED, payload: error })
      );
    });
  });

  describe('deletePolicies Sequence', () => {
    const action = { policyIds: ['1'], fqon: 'iamfqon' };
    const saga = deletePolicies(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.all, [axios.delete('iamfqon/policies/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({ type: types.DELETE_POLICY_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deletePolicies(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deletePolicies(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: types.DELETE_POLICY_REJECTED, payload: error })
      );
    });
  });

  describe('policySagas', () => {
    let result;
    const rootSaga = policySagas();

    it('should fork a watcher for fetchPolicies', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_POLICIES_REQUEST, fetchPolicies)
      );
    });

    it('should fork a watcher for fetchPolicy', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.FETCH_POLICY_REQUEST, fetchPolicy)
      );
    });

    it('should fork a watcher for createPolicy', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.CREATE_POLICY_REQUEST, createPolicy)
      );
    });

    it('should fork a watcher for updatePolicy', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.UPDATE_POLICY_REQUEST, updatePolicy)
      );
    });

    it('should fork a watcher for deletePolicy', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DELETE_POLICY_REQUEST, deletePolicy)
      );
    });

    it('should fork a watcher for deletePolicies', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, types.DELETE_POLICIES_REQUEST, deletePolicies)
      );
    });
  });
});
