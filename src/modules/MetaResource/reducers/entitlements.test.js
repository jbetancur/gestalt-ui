import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './entitlements';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  entitlements: [],
  error: null,
};

describe('entitlements reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ entitlements: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_ENTITLEMENTS', () => {
    expect(
      reducer({ entitlements: [{ id: 1 }] }, metaActions.unloadEntitlements())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ENTITLEMENTS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchEntitlements())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ENTITLEMENTS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENTITLEMENTS_FULFILLED,
        payload: [...initialState.entitlements, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      entitlements: [...initialState.entitlements, { id: 1 }],
    });
  });

  it('should handle FETCH_ENTITLEMENTS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENTITLEMENTS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle UDPATE_ENTITLEMENT_TOGGLE_STATE', () => {
    expect(
      reducer({}, {
        type: types.UDPATE_ENTITLEMENT_TOGGLE_STATE,
        payload: { id: 1 },
      })
    ).to.deep.equal({
      entitlements: { id: 1 },
    });
  });
});
