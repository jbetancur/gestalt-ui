import * as types from '../actionTypes';
import * as actions from './apis';

describe('API Actions', () => {
  it('should request UNLOAD_APIS', () => {
    const expectedAction = {
      type: types.UNLOAD_APIS,
    };

    expect(actions.unloadAPIs()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_APIS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_APIS_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchAPIs('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_API_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_API_REQUEST,
      fqon: 'iamfqon',
      apiId: '1',
    };

    expect(actions.fetchAPI('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_API_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_API_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createAPI('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_API_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_API_REQUEST,
      fqon: 'iamfqon',
      environmentId: '2',
      apiId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateAPI('iamfqon', '2', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_API_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_API_REQUEST,
      fqon: 'iamfqon',
      apiId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteAPI('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_APIS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_APIS_REQUEST,
      apiIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteAPIs([], 'iamfqon')).to.deep.equal(expectedAction);
  });
});
