import * as types from '../actionTypes';
import * as actions from './streamSpecs';

describe('Stream Actions', () => {
  it('should request UNLOAD_STREAMSPECS', () => {
    const expectedAction = {
      type: types.UNLOAD_STREAMSPECS,
    };

    expect(actions.unloadStreamSpecs()).toEqual(expectedAction);
  });

  it('should request UNLOAD_STREAMSPEC', () => {
    const expectedAction = {
      type: types.UNLOAD_STREAMSPEC,
    };

    expect(actions.unloadStreamSpec()).toEqual(expectedAction);
  });

  it('should request FETCH_STREAMSPECS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_STREAMSPECS_REQUEST,
      payload: {
        fqon: 'iamfqon',
        entityId: '1',
        entityKey: 'environments',
      }
    };

    expect(actions.fetchStreamSpecSpecs({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments' })).toEqual(expectedAction);
  });

  it('should request FETCH_STREAMSPEC_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_STREAMSPEC_REQUEST,
      payload: {
        fqon: 'iamfqon',
        id: '1',
      }
    };

    expect(actions.fetchStreamSpec({ fqon: 'iamfqon', id: '1' })).toEqual(expectedAction);
  });

  it('should handle CREATE_STREAMSPEC_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_STREAMSPEC_REQUEST,
      payload: {
        fqon: 'iamfqon',
        entityId: '1',
        entityKey: 'environments',
        payload: { name: 'test' },
        onSuccess: undefined,
      }
    };

    expect(actions.createStreamSpec({ fqon: 'iamfqon', entityId: '1', entityKey: 'environments', payload: { name: 'test' } })).toEqual(expectedAction);
  });

  it('should handle UPDATE_STREAMSPEC_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_STREAMSPEC_REQUEST,
      payload: {
        fqon: 'iamfqon',
        id: '1',
        payload: [],
        onSuccess: undefined,
      }
    };

    expect(actions.updateStreamSpec({ fqon: 'iamfqon', id: '1', payload: [] })).toEqual(expectedAction);
  });

  it('should handle DELETE_STREAMSPEC_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_STREAMSPEC_REQUEST,
      payload: {
        fqon: 'iamfqon',
        id: '1',
        onSuccess: undefined,
      }
    };

    expect(actions.deleteStreamSpec({ fqon: 'iamfqon', id: '1' })).toEqual(expectedAction);
  });

  it('should handle DELETE_STREAMSPECS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_STREAMSPECS_REQUEST,
      payload: {
        ids: [],
        fqon: 'iamfqon',
        onSuccess: undefined,
      }
    };

    expect(actions.deleteStreamSpecs({ fqon: 'iamfqon', ids: [] })).toEqual(expectedAction);
  });
});
