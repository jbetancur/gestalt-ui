import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './providerKongsByGateway';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  providers: [],
  error: null,
};

describe('providerKongsByGateway reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ providers: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_PROVIDERS_KONG_GATEWAY_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchProviderKongsByGateway())
    ).to.deep.equal({
      pending: true,
      providers: [{ id: '', name: 'fetching providers...' }],
    });
  });

  it('should handle FETCH_PROVIDERS_KONG_GATEWAY_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDERS_KONG_GATEWAY_FULFILLED,
        payload: [...initialState.providers, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      providers: [...initialState.providers, { id: 1 }],
    });
  });

  it('should handle FETCH_PROVIDERS_KONG_GATEWAY_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDERS_KONG_GATEWAY_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
