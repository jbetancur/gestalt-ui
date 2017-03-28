import * as types from '../actionTypes';
import reducer from './allOrganizations';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  error: null,
};

describe('allOrganizations reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_ALLORGS', () => {
    expect(
      reducer({}, metaActions.onUnloadAllOrgs())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ALLORGS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchAllOrgs())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ALLORGS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ALLORGS_FULFILLED,
        payload: [...initialState.organizations, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organizations: [...initialState.organizations, { id: 1 }],
    });
  });

  it('should handle FETCH_ALLORGS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ALLORGS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
