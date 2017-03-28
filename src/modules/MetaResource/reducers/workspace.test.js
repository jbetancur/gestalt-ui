import * as types from '../actionTypes';
import reducer from './workspace';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  workspace: {
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

describe('workspace reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_WORKSPACE', () => {
    expect(
      reducer({}, metaActions.onUnloadWorkspace())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_WORKSPACE_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchWorkspace())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_WORKSPACE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_WORKSPACE_FULFILLED,
        payload: { ...initialState.workspace, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      workspace: { ...initialState.workspace, id: 1 },
    });
  });

  it('should handle FETCH_WORKSPACE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_WORKSPACE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_WORKSPACE_REQUEST', () => {
    expect(
      reducer({}, metaActions.createWorkspace())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_WORKSPACE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_WORKSPACE_FULFILLED,
        payload: { ...initialState.workspace, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      workspace: { ...initialState.workspace, id: 1 },
    });
  });

  it('should handle CREATE_WORKSPACE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_WORKSPACE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle UPDATE_WORKSPACE_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateWorkspace())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_WORKSPACE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_WORKSPACE_FULFILLED,
        payload: { ...initialState.workspace, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      workspace: { ...initialState.workspace, id: 1 },
    });
  });

  it('should handle UPDATE_WORKSPACE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_WORKSPACE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_WORKSPACE_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteWorkspace())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_WORKSPACE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_WORKSPACE_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_WORKSPACE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_WORKSPACE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
