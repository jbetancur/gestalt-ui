import * as types from '../actionTypes';
import * as actions from './apiEndpoints';

describe('API Actions', () => {
  it('should request UNLOAD_APIENDPOINTS', () => {
    const expectedAction = {
      type: types.UNLOAD_APIENDPOINTS,
    };

    expect(actions.unloadAPIEndpoints()).to.deep.equal(expectedAction);
  });

  it('should request UNLOAD_APIENDPOINT', () => {
    const expectedAction = {
      type: types.UNLOAD_APIENDPOINT,
    };

    expect(actions.unloadAPIEndpoint()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_APIENDPOINTS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_APIENDPOINTS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'apis',
    };

    expect(actions.fetchAPIEndpoints('iamfqon', '1', 'apis')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_APIENDPOINT_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_APIENDPOINT_REQUEST,
      fqon: 'iamfqon',
      apiendpointId: '1',
      onSuccess: undefined,
    };

    expect(actions.fetchAPIEndpoint('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_APIENDPOINT_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_APIENDPOINT_REQUEST,
      fqon: 'iamfqon',
      apiId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createAPIEndpoint('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_APIENDPOINT_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_APIENDPOINT_REQUEST,
      fqon: 'iamfqon',
      apiendpointId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateAPIEndpoint('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_APIENDPOINT_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_APIENDPOINT_REQUEST,
      fqon: 'iamfqon',
      apiendpointId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteAPIEndpoint('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_APIENDPOINTS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_APIENDPOINTS_REQUEST,
      apiendpointIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteAPIEndpoints([], 'iamfqon')).to.deep.equal(expectedAction);
  });
});
