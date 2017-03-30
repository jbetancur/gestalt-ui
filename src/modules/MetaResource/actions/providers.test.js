import * as types from '../actionTypes';
import * as actions from './providers';

describe('Provider Actions', () => {
  it('should request FETCH_PROVIDERS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_PROVIDERS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
    };

    expect(actions.fetchProviders('iamfqon', '1', 'environments')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_PROVIDERS_BYTYPE_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_PROVIDERS_BYTYPE_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      providerType: 'whateverType',
    };

    expect(actions.fetchProvidersByType('iamfqon', '1', 'environments', 'whateverType')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_EXECUTORS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_EXECUTORS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      executorType: 'whateverType',
    };

    expect(actions.fetchExecutors('iamfqon', '1', 'environments', 'whateverType')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_PROVIDER_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_PROVIDER_REQUEST,
      fqon: 'iamfqon',
      providerId: '1',
    };

    expect(actions.fetchProvider('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_PROVIDER_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_PROVIDER_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createProvider('iamfqon', '1', 'environments', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_PROVIDER_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_PROVIDER_REQUEST,
      fqon: 'iamfqon',
      providerId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateProvider('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_PROVIDER_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_PROVIDER_REQUEST,
      fqon: 'iamfqon',
      providerId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteProvider('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_PROVIDERS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_PROVIDERS_REQUEST,
      providerIds: [],
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      onSuccess: undefined,
    };

    expect(actions.deleteProviders([], 'iamfqon', '1', 'environments')).to.deep.equal(expectedAction);
  });
});
