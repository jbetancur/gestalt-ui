import * as types from '../actionTypes';
import * as actions from './containers';

describe('Container Actions', () => {
  it('should request UNLOAD_CONTAINERS', () => {
    const expectedAction = {
      type: types.UNLOAD_CONTAINERS,
    };

    expect(actions.unloadContainers()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_CONTAINERS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_CONTAINERS_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      isPolling: false,
    };

    expect(actions.fetchContainers('iamfqon', '1', false)).to.deep.equal(expectedAction);
  });

  it('should request FETCH_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      containerId: '1',
      environmentId: '2',
      isPolling: false,
    };

    expect(actions.fetchContainer('iamfqon', '1', '2', false)).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createContainer('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      containerId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateContainer('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      containerId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteContainer('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle SCALE_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.SCALE_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      containerId: '2',
      numInstances: 42,
      onSuccess: undefined,
    };

    expect(actions.scaleContainer('iamfqon', '2', 42)).to.deep.equal(expectedAction);
  });

  it('should handle MIGRATE_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.MIGRATE_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      containerId: '2',
      providerId: '3',
      onSuccess: undefined,
    };

    expect(actions.migrateContainer('iamfqon', '2', '3')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_PROVIDER_CONTAINER_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_PROVIDER_CONTAINER_REQUEST,
      fqon: 'iamfqon',
      providerId: '1',
    };

    expect(actions.fetchProviderContainer('iamfqon', '1')).to.deep.equal(expectedAction);
  });
});
