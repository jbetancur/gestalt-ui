import * as types from '../actionTypes';
import reducer from './workspaces';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  workspaces: [],
  error: null,
};

describe('workspaces reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_WORKSPACES', () => {
    expect(
      reducer({ workspaces: [{ id: 1 }] }, metaActions.unloadWorkspaces())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_WORKSPACES_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchWorkspaces())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_WORKSPACES_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_WORKSPACES_FULFILLED,
        payload: [...initialState.workspaces, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      workspaces: [...initialState.workspaces, { id: 1 }],
    });
  });

  it('should handle FETCH_WORKSPACES_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_WORKSPACES_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
