import * as types from '../actionTypes';
import reducer from './organizations';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  error: null,
};

describe('organizations reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_ORGS', () => {
    expect(
      reducer({}, metaActions.onUnloadOrgs())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ORGS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchOrgs())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ORGS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ORGS_FULFILLED,
        payload: [...initialState.organizations, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organizations: [...initialState.organizations, { id: 1 }],
    });
  });

  it('should handle FETCH_ORGS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ORGS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
