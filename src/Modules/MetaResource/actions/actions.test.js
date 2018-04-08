import * as types from '../actionTypes';
import * as actions from './actions';

describe('Provider Actions', () => {
  it('should request UNLOAD_ACTIONS', () => {
    const expectedAction = {
      type: types.UNLOAD_ACTIONS,
    };

    expect(actions.unloadActions()).toEqual(expectedAction);
  });

  it('should request UNLOAD_CONTEXT_ACTIONS', () => {
    const expectedAction = {
      type: types.UNLOAD_CONTEXT_ACTIONS,
    };

    expect(actions.unloadContextActions()).toEqual(expectedAction);
  });


  it('should request FETCH_ACTIONS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_ACTIONS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      filters: {},
    };

    expect(actions.fetchActions('iamfqon', '1', 'environments', {})).toEqual(expectedAction);
  });

  it('should request FETCH_CONTEXT_ACTIONS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_CONTEXT_ACTIONS_REQUEST,
      fqon: 'iamfqon',
      entityId: '1',
      entityKey: 'environments',
      filters: {},
    };

    expect(actions.fetchContextActions('iamfqon', '1', 'environments', {})).toEqual(expectedAction);
  });
});
