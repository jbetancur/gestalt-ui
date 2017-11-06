import * as types from '../actionTypes';
import * as actions from './policies';

describe('Policy Actions', () => {
  it('should request UNLOAD_POLICIES', () => {
    const expectedAction = {
      type: types.UNLOAD_POLICIES,
    };

    expect(actions.unloadPolicies()).to.deep.equal(expectedAction);
  });

  it('should request UNLOAD_POLICY', () => {
    const expectedAction = {
      type: types.UNLOAD_POLICY,
    };

    expect(actions.unloadPolicy()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_POLICIES_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_POLICIES_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchPolicies('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_POLICY_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_POLICY_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
    };

    expect(actions.fetchPolicy('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_POLICY_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_POLICY_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createPolicy('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_POLICY_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_POLICY_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updatePolicy('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_POLICY_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_POLICY_REQUEST,
      fqon: 'iamfqon',
      policyId: '1',
      onSuccess: undefined,
    };

    expect(actions.deletePolicy('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_POLICIES_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_POLICIES_REQUEST,
      policyIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deletePolicies([], 'iamfqon')).to.deep.equal(expectedAction);
  });
});
