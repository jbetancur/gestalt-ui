import * as actionTypes from '../actionTypes';
import * as actions from './workspaces';

describe('Workspace Actions', () => {
  it('should request UNLOAD_WORKSPACES', () => {
    const expectedAction = {
      type: actionTypes.UNLOAD_WORKSPACES,
    };

    expect(actions.unloadWorkspaces()).toEqual(expectedAction);
  });

  it('should request UNLOAD_WORKSPACE', () => {
    const expectedAction = {
      type: actionTypes.UNLOAD_WORKSPACE,
    };

    expect(actions.unloadWorkspace()).toEqual(expectedAction);
  });

  it('should request FETCH_WORKSPACES_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_WORKSPACES_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchWorkspaces('iamfqon')).toEqual(expectedAction);
  });

  it('should request FETCH_WORKSPACE_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_WORKSPACE_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
    };

    expect(actions.fetchWorkspace('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should handle CREATE_WORKSPACE_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.CREATE_WORKSPACE_REQUEST,
      fqon: 'iamfqon',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createWorkspace('iamfqon', { name: 'test' })).toEqual(expectedAction);
  });

  it('should handle UPDATE_WORKSPACE_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_WORKSPACE_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateWorkspace('iamfqon', '1', [])).toEqual(expectedAction);
  });

  it('should handle DELETE_WORKSPACE_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.DELETE_WORKSPACE_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteWorkspace('iamfqon', '1')).toEqual(expectedAction);
  });
});
