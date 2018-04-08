import * as types from '../actionTypes';
import * as actions from './entitlements';

describe('Entitlements Actions', () => {
  it('should request UNLOAD_ENTITLEMENTS', () => {
    const expectedAction = {
      type: types.UNLOAD_ENTITLEMENTS,
    };

    expect(actions.unloadEntitlements()).toEqual(expectedAction);
  });

  it('should request FETCH_ENTITLEMENTS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ENTITLEMENTS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'workspaces',
      selectedIdentityId: '2',
    };

    expect(actions.fetchEntitlements('iamfqon', '1', 'workspaces', '2')).toEqual(expectedAction);
  });

  it('should request FETCH_IDENTITIES_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_IDENTITIES_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchIdentities('iamfqon')).toEqual(expectedAction);
  });


  it('should handle UPDATE_ENTITLEMENT_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_ENTITLEMENT_REQUEST,
      fqon: 'iamfqon',
      newIdentityId: '2',
      actions: [{ id: 1 }],
      entityId: '1',
      entityKey: 'workspaces',
      onSuccess: undefined,
    };

    expect(actions.updateEntitlements('iamfqon', '2', [{ id: 1 }], '1', 'workspaces')).toEqual(expectedAction);
  });
});
