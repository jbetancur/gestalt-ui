import { metaActions } from 'modules/MetaResource';
import reducer from './currentWorkspaceContext';

const initialState = {
  workspace: {
    org: {},
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
};

describe('currentWorkspaceContext reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_CURRENT_WORKSPACE_CONTEXT and clear the state', () => {
    expect(
      reducer({}, metaActions.unloadWorkspaceContext())
    ).to.deep.equal(initialState);
  });

  it('should handle UPDATE_CURRENT_WORKSPACE_CONTEXT', () => {
    expect(
      reducer({}, metaActions.setCurrentWorkspaceContext({ ...initialState.workspace, id: 1 }))
    ).to.deep.equal({
      workspace: { ...initialState.workspace, id: 1 },
    });
  });
});
