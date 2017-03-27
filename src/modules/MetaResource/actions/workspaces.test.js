import * as actionTypes from '../actionTypes';
import * as actions from './workspaces';

describe('Workspace Actions', () => {
  it('should request FETCH_WORKSPACES_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_WORKSPACES_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchWorkspaces('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_WORKSPACE_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_WORKSPACE_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
    };

    expect(actions.fetchWorkspace('iamfqon', '1')).to.deep.equal(expectedAction);
  });
});
