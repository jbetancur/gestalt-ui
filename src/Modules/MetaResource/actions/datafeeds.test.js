import * as types from '../actionTypes';
import * as actions from './datafeeds';

describe('Datafeed Actions', () => {
  it('should request UNLOAD_DATAFEEDS', () => {
    const expectedAction = {
      type: types.UNLOAD_DATAFEEDS,
    };

    expect(actions.unloadDatafeeds()).toEqual(expectedAction);
  });

  it('should request UNLOAD_DATAFEED', () => {
    const expectedAction = {
      type: types.UNLOAD_DATAFEED,
    };

    expect(actions.unloadDatafeed()).toEqual(expectedAction);
  });

  it('should request FETCH_DATAFEEDS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_DATAFEEDS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
    };

    expect(actions.fetchDatafeeds({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' })).toEqual(expectedAction);
  });

  it('should request FETCH_DATAFEED_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_DATAFEED_REQUEST,
      fqon: 'iamfqon',
      id: '1',
    };

    expect(actions.fetchDatafeed({ fqon: 'iamfqon', id: '1' })).toEqual(expectedAction);
  });

  it('should handle CREATE_DATAFEED_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_DATAFEED_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createDatafeed({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', payload: { name: 'test' } })).toEqual(expectedAction);
  });

  it('should handle UPDATE_DATAFEED_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_DATAFEED_REQUEST,
      fqon: 'iamfqon',
      id: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateDatafeed({ fqon: 'iamfqon', id: '1', payload: [] })).toEqual(expectedAction);
  });

  it('should handle DELETE_DATAFEED_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_DATAFEED_REQUEST,
      fqon: 'iamfqon',
      id: '1',
      onSuccess: undefined,
      params: { force: true },
    };

    expect(actions.deleteDatafeed({ fqon: 'iamfqon', id: '1' })).toEqual(expectedAction);
  });

  it('should handle DELETE_DATAFEEDS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_DATAFEEDS_REQUEST,
      ids: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
      params: { force: true },
    };

    expect(actions.deleteDatafeeds({ fqon: 'iamfqon', ids: [] })).toEqual(expectedAction);
  });
});
