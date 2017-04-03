import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './entitlementIdentities';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  identities: [],
  error: null,
};

describe('entitlement identities reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ identities: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_ENTITLEMENTS', () => {
    expect(
      reducer({ identities: [{ id: 1 }] }, metaActions.unloadEntitlements())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_IDENTITIES_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchIdentities())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_IDENTITIES_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_IDENTITIES_FULFILLED,
        payload: [...initialState.identities, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      identities: [...initialState.identities, { id: 1 }],
    });
  });

  it('should handle FETCH_IDENTITIES_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_IDENTITIES_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
