import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './entitlementSelectedIdentity';
import metaActions from '../actions';

const initialState = {
  identity: {},
};

describe('entitlementSelectedIdentity reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ identity: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_ENTITLEMENTS', () => {
    expect(
      reducer({ identity: { id: 1 } }, metaActions.unloadEntitlements())
    ).to.deep.equal(initialState);
  });

  it('should handle SELECTED_IDENTITY', () => {
    expect(
      reducer({}, { type: types.SELECTED_IDENTITY, payload: { id: 1, name: 'nice entitlement bro' } })
    ).to.deep.equal({
      identity: { id: 1, name: 'nice entitlement bro' },
    });
  });
});
