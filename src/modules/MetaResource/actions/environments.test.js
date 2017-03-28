import * as actionTypes from '../actionTypes';
import * as actions from './environments';

describe('Environment Actions', () => {
  it('should request FETCH_ENVIRONMENTS_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ENVIRONMENTS_REQUEST,
      fqon: 'iamfqon',
      workspaceId: undefined,
    };

    expect(actions.fetchEnvironments('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchEnvironment('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.CREATE_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createEnvironment('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateEnvironment('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.DELETE_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteEnvironment('iamfqon', '1')).to.deep.equal(expectedAction);
  });
});
