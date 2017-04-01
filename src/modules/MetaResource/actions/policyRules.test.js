import * as types from '../actionTypes';
import * as actions from './policyRules';

describe('Policy Rule Actions', () => {
  it('should request UNLOAD_POLICYRULES', () => {
    const expectedAction = {
      type: types.UNLOAD_POLICYRULES,
    };

    expect(actions.unloadPolicyRules()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_POLICYRULES_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_POLICYRULES_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
    };

    expect(actions.fetchPolicyRules('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_POLICYRULE_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_POLICYRULE_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
      ruleId: '2',
    };

    expect(actions.fetchPolicyRule('iamfqon', '1', '2')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_POLICYRULE_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_POLICYRULE_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createPolicyRule('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_POLICYRULE_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_POLICYRULE_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
      ruleId: '2',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updatePolicyRule('iamfqon', '1', '2', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_POLICYRULE_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_POLICYRULE_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
      ruleId: '2',
      onSuccess: undefined,
    };

    expect(actions.deletePolicyRule('iamfqon', '1', '2')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_POLICYRULES_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_POLICYRULES_REQUEST,
      ruleIds: [],
      fqon: 'iamfqon',
      policyId: '1',
      onSuccess: undefined,
    };

    expect(actions.deletePolicyRules([], 'iamfqon', '1')).to.deep.equal(expectedAction);
  });
});
