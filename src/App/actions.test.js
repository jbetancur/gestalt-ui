// import nock from 'nock';
// import configureStore from 'redux-mock-store';
import * as actions from './actions';
import * as types from './actionTypes';

// const middlewares = [];
// const mockStore = configureStore(middlewares);

describe('App Actions', () => {
  it('should set the org context', () => {
    const expectedAction = {
      type: types.CURRENT_ORG_CONTEXT,
      payload: { id: 1 },
    };

    expect(actions.setCurrentOrgContext({ id: 1 })).to.deep.equal(expectedAction);
  });

  it('should set the workspace context', () => {
    const expectedAction = {
      type: types.CURRENT_WORKSPACE_CONTEXT,
      payload: { id: 1 },
    };

    expect(actions.setCurrentWorkspaceContext({ id: 1 })).to.deep.equal(expectedAction);
  });

  it('should set the environment context', () => {
    const expectedAction = {
      type: types.CURRENT_ENVIRONMENT_CONTEXT,
      payload: { id: 1 },
    };

    expect(actions.setCurrentEnvironmentContext({ id: 1 })).to.deep.equal(expectedAction);
  });

  it('should clear (unload) the workspace context', () => {
    const expectedAction = {
      type: types.UNLOAD_CURRENT_WORKSPACE_CONTEXT,
    };

    expect(actions.unloadWorkspaceContext()).to.deep.equal(expectedAction);
  });

  it('should clear (unload) the environment context', () => {
    const expectedAction = {
      type: types.UNLOAD_CURRENT_ENVIRONMENT_CONTEXT,
    };

    expect(actions.unloadEnvironmentContext()).to.deep.equal(expectedAction);
  });
});
