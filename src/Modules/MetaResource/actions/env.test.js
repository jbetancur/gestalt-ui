import * as types from '../actionTypes';
import * as actions from './env';

describe('Env Actions', () => {
  it('should request UNLOAD_ENV_SCHEMA', () => {
    const expectedAction = {
      type: types.UNLOAD_ENV_SCHEMA,
    };

    expect(actions.unloadEnvSchema()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ENV_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ENV_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'whatevs',
    };

    expect(actions.fetchEnv('iamfqon', '1', 'whatevs')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ENV_SCHEMA_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ENV_SCHEMA_REQUEST,
      resourceTypeId: '1',
    };

    expect(actions.fetchEnvSchema('1')).to.deep.equal(expectedAction);
  });
});
