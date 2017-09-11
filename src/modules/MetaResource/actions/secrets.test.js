import * as types from '../actionTypes';
import * as actions from './secrets';

describe('Secrets Actions', () => {
  it('should request FETCH_SECRETS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_SECRETS_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchSecrets('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_SECRETS_DROPDOWN_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_SECRETS_DROPDOWN_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchSecretsDropDown('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_SECRET_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_SECRET_REQUEST,
      fqon: 'iamfqon',
      secretId: '1',
    };

    expect(actions.fetchSecret('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_SECRET_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_SECRET_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createSecret('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_SECRET_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_SECRET_REQUEST,
      fqon: 'iamfqon',
      secretId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateSecret('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_SECRET_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_SECRET_REQUEST,
      fqon: 'iamfqon',
      secretId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteSecret('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_SECRETS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_SECRETS_REQUEST,
      secretIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteSecrets([], 'iamfqon')).to.deep.equal(expectedAction);
  });
});
