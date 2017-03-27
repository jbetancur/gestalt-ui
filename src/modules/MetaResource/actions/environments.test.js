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
});
