import * as types from '../actionTypes';
import reducer from './organizationSet';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  organization: {
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

describe('organizations reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_ORGSET', () => {
    expect(
      reducer({}, metaActions.onUnloadOrgSet())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ORGSET_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchOrgSet())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ORGSET_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ORGSET_FULFILLED,
        payload: { organizations: [...initialState.organizations, { id: 1 }], organization: { id: 1 } },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organizations: [...initialState.organizations, { id: 1 }],
      organization: { id: 1 },
    });
  });

  it('should handle FETCH_ORGSET_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ORGSET_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
