import * as actionTypes from '../actionTypes';
import * as actions from './context';

describe('Context Actions', () => {
  it('should set the org context', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_CURRENT_ORG_CONTEXT,
      payload: { id: 1 },
    };

    expect(actions.setCurrentOrgContext({ id: 1 })).to.deep.equal(expectedAction);
  });

  it('should set the workspace context', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_CURRENT_WORKSPACE_CONTEXT,
      payload: { id: 1 },
    };

    expect(actions.setCurrentWorkspaceContext({ id: 1 })).to.deep.equal(expectedAction);
  });

  it('should set the environment context', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_CURRENT_ENVIRONMENT_CONTEXT,
      payload: { id: 1 },
    };

    expect(actions.setCurrentEnvironmentContext({ id: 1 })).to.deep.equal(expectedAction);
  });

  it('should set the current org context based on the state', () => {
    const expectedAction = {
      type: actionTypes.SET_CURRENT_ORG_CONTEXT_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.setCurrentOrgContextfromState('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should set the current workspace context based on the state', () => {
    const expectedAction = {
      type: actionTypes.SET_CURRENT_WORKSPACE_CONTEXT_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
    };

    expect(actions.setCurrentWorkspaceContextfromState('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should set the current environment context based on the state', () => {
    const expectedAction = {
      type: actionTypes.SET_CURRENT_ENVIRONMENT_CONTEXT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.setCurrentEnvironmentContextfromState('iamfqon', '1')).to.deep.equal(expectedAction);
  });
});
