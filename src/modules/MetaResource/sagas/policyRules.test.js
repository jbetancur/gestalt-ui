import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import policyRuleSagas, {
  fetchPolicyRules,
  fetchPolicyRule,
  createPolicyRule,
  updatePolicyRule,
  deletePolicyRule,
  deletePolicyRules,
} from './policyRules';
import * as types from '../actionTypes';

describe('PolicyRule Sagas', () => {
  const error = 'an error has occured';

  describe('fetchPolicyRules Sequence', () => {
    const saga = fetchPolicyRules({ fqon: 'iamfqon', policyId: '1' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/policies/1/rules?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_POLICYRULES_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchPolicyRules({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_POLICYRULES_REJECTED, payload: error })
      );
    });
  });

  describe('fetchPolicyRule Sequence', () => {
    const saga = fetchPolicyRule({ fqon: 'iamfqon', policyId: '1', ruleId: '2' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/policies/1/rules/2')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_POLICYRULE_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchPolicyRule({ fqon: 'iamfqon', policyId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_POLICYRULE_REJECTED, payload: error })
      );
    });
  });

  describe('createPolicyRule Sequence', () => {
    const action = { fqon: 'iamfqon', policyId: '1', payload: { name: 'iamnewPolicyRule' } };
    const saga = createPolicyRule(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/policies/1/rules', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.CREATE_POLICYRULE_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createPolicyRule(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createPolicyRule(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_POLICYRULE_REJECTED, payload: error })
      );
    });
  });

  describe('updatePolicyRule Sequence', () => {
    const action = { fqon: 'iamfqon', policyId: '1', ruleId: '2', payload: [] };
    const saga = updatePolicyRule(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, 'iamfqon/policies/1/rules/2', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_POLICYRULE_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', policyId: '1', ruleId: '2', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updatePolicyRule(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updatePolicyRule(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_POLICYRULE_REJECTED, payload: error })
      );
    });
  });

  describe('deletePolicyRule Sequence', () => {
    const action = { fqon: 'iamfqon', policyId: '1', ruleId: '2' };
    const saga = deletePolicyRule(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/policies/1/rules/2?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_POLICYRULE_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deletePolicyRule(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deletePolicyRule(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_POLICYRULE_REJECTED, payload: error })
      );
    });
  });

  describe('deletePolicyRules Sequence', () => {
    const action = { ruleIds: ['1'], fqon: 'iamfqon', policyId: '2' };
    const saga = deletePolicyRules(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.all, [axios.delete('iamfqon/policies/2/rules/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_POLICYRULE_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deletePolicyRules(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deletePolicyRules(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_POLICYRULE_REJECTED, payload: error })
      );
    });
  });

  describe('policyRuleSagas', () => {
    let result;
    const rootSaga = policyRuleSagas();

    it('should fork a watcher for fetchPolicyRules', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_POLICYRULES_REQUEST, fetchPolicyRules)
      );
    });

    it('should fork a watcher for fetchPolicyRule', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_POLICYRULE_REQUEST, fetchPolicyRule)
      );
    });

    it('should fork a watcher for createPolicyRule', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_POLICYRULE_REQUEST, createPolicyRule)
      );
    });

    it('should fork a watcher for updatePolicyRule', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_POLICYRULE_REQUEST, updatePolicyRule)
      );
    });

    it('should fork a watcher for deletePolicyRule', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_POLICYRULE_REQUEST, deletePolicyRule)
      );
    });

    it('should fork a watcher for deletePolicyRules', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_POLICYRULES_REQUEST, deletePolicyRules)
      );
    });
  });
});
