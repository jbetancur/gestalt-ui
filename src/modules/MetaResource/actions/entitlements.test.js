import * as types from '../actionTypes';
import * as actions from './entitlements';

describe('Entitlements Actions', () => {
  it('should request UNLOAD_ENTITLEMENTS', () => {
    const expectedAction = {
      type: types.UNLOAD_ENTITLEMENTS,
    };

    expect(actions.unloadEntitlements()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ENTITLEMENTS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ENTITLEMENTS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'workspaces',
      selectedIdentity: { id: 1 },
    };

    expect(actions.fetchEntitlements('iamfqon', '1', 'workspaces', { id: 1 })).to.deep.equal(expectedAction);
  });

  it('should request FETCH_IDENTITIES_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_IDENTITIES_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchIdentities('iamfqon')).to.deep.equal(expectedAction);
  });


  it('should handle UPDATE_ENTITLEMENT_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_ENTITLEMENT_REQUEST,
      fqon: 'iamfqon',
      newIdentity: '2',
      actions: [{ id: 1 }],
      entityId: '1',
      entityKey: 'workspaces',
      onSuccess: undefined,
    };

    expect(actions.updateEntitlements('iamfqon', '2', [{ id: 1 }], '1', 'workspaces')).to.deep.equal(expectedAction);
  });
});
