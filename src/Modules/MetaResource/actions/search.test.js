import * as types from '../actionTypes';
import * as actions from './search';

describe('Search Actions', () => {
  it('should request UNLOAD_SEARCH', () => {
    const expectedAction = {
      type: types.UNLOAD_SEARCH,
    };

    expect(actions.unloadSearch()).toEqual(expectedAction);
  });

  it('should request FETCH_SEARCH_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_SEARCH_REQUEST,
      fqon: 'iamfqon',
      entity: 'user',
      value: 'morty',
      field: 'name',
    };

    expect(actions.doSearch('iamfqon', 'user', 'morty', 'name')).toEqual(expectedAction);
  });
});
