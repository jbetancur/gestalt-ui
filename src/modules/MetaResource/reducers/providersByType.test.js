import * as types from '../actionTypes';
import reducer from './providersByType';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  providers: [],
  error: null,
};

describe('providersByType reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_PROVIDERS_BYTYPE_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchProvidersByType())
    ).to.deep.equal({
      pending: true,
      providers: [{ id: '', name: 'fetching providers...' }],
    });
  });

  it('should handle FETCH_PROVIDERS_BYTYPE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDERS_BYTYPE_FULFILLED,
        payload: [...initialState.providers, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      providers: [...initialState.providers, { id: 1 }],
    });
  });

  it('should handle FETCH_PROVIDERS_BYTYPE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDERS_BYTYPE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
