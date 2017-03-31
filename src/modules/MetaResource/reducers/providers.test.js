import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './providers';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  providers: [],
  error: null,
};

describe('providers reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_PROVIDERS', () => {
    expect(
      reducer({ providers: [{ id: 1 }] }, metaActions.unloadProviders())
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ providers: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_PROVIDERS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchProviders())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_PROVIDERS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDERS_FULFILLED,
        payload: [...initialState.providers, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      providers: [...initialState.providers, { id: 1 }],
    });
  });

  it('should handle FETCH_PROVIDERS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDERS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_PROVIDERS_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteProviders())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_PROVIDER_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteProvider())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_PROVIDER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_PROVIDER_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_PROVIDER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_PROVIDER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
