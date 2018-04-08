import * as types from '../actionTypes';
import * as actions from './environments';

describe('Environment Actions', () => {
  it('should request UNLOAD_ENVIRONMENTS', () => {
    const expectedAction = {
      type: types.UNLOAD_ENVIRONMENTS,
    };

    expect(actions.unloadEnvironments()).toEqual(expectedAction);
  });

  it('should request UNLOAD_ENVIRONMENT', () => {
    const expectedAction = {
      type: types.UNLOAD_ENVIRONMENT,
    };

    expect(actions.unloadEnvironment()).toEqual(expectedAction);
  });

  it('should request FETCH_ENVIRONMENTS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ENVIRONMENTS_REQUEST,
      fqon: 'iamfqon',
      workspaceId: undefined,
    };

    expect(actions.fetchEnvironments('iamfqon')).toEqual(expectedAction);
  });

  it('should request FETCH_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchEnvironment('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should handle CREATE_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      workspaceId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createEnvironment('iamfqon', '1', { name: 'test' })).toEqual(expectedAction);
  });

  it('should handle UPDATE_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateEnvironment('iamfqon', '1', [])).toEqual(expectedAction);
  });

  it('should handle DELETE_ENVIRONMENT_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_ENVIRONMENT_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteEnvironment('iamfqon', '1')).toEqual(expectedAction);
  });
});
