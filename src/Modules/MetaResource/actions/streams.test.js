import * as types from '../actionTypes';
import * as actions from './streams';

describe('Stream Actions', () => {
  it('should request UNLOAD_STREAMS', () => {
    const expectedAction = {
      type: types.UNLOAD_STREAMS,
    };

    expect(actions.unloadStreams()).toEqual(expectedAction);
  });

  it('should request UNLOAD_STREAM', () => {
    const expectedAction = {
      type: types.UNLOAD_STREAM,
    };

    expect(actions.unloadStream()).toEqual(expectedAction);
  });

  it('should request FETCH_STREAMS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_STREAMS_REQUEST,
      payload: {
        fqon: 'iamfqon',
        entityId: '1',
        entityKey: 'environments',
      }
    };

    expect(actions.fetchStreams({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' })).toEqual(expectedAction);
  });

  it('should request FETCH_STREAM_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_STREAM_REQUEST,
      payload: {
        fqon: 'iamfqon',
        id: '1',
      }
    };

    expect(actions.fetchStream({ fqon: 'iamfqon', id: '1' })).toEqual(expectedAction);
  });

  it('should handle CREATE_STREAM_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_STREAM_REQUEST,
      payload: {
        fqon: 'iamfqon',
        entityId: '1',
        entityKey: 'environments',
        payload: { name: 'test' },
        onSuccess: undefined,
      }
    };

    expect(actions.createStream({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', payload: { name: 'test' } })).toEqual(expectedAction);
  });

  it('should handle UPDATE_STREAM_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_STREAM_REQUEST,
      payload: {
        fqon: 'iamfqon',
        id: '1',
        payload: [],
        onSuccess: undefined,
      }
    };

    expect(actions.updateStream({ fqon: 'iamfqon', id: '1', payload: [] })).toEqual(expectedAction);
  });

  it('should handle DELETE_STREAM_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_STREAM_REQUEST,
      payload: {
        fqon: 'iamfqon',
        id: '1',
        onSuccess: undefined,
      }
    };

    expect(actions.deleteStream({ fqon: 'iamfqon', id: '1' })).toEqual(expectedAction);
  });

  it('should handle DELETE_STREAMS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_STREAMS_REQUEST,
      payload: {
        ids: [],
        fqon: 'iamfqon',
        onSuccess: undefined,
      }
    };

    expect(actions.deleteStreams({ fqon: 'iamfqon', ids: [] })).toEqual(expectedAction);
  });
});
