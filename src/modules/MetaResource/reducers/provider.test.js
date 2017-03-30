import * as types from '../actionTypes';
import reducer from './provider';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  provider: {
    created: {},
    modified: {},
    properties: {
      config: {
        auth: {},
        env: {
          private: {},
          public: {},
        },
        networks: []
      },
      linked_providers: [],
      locations: [],
      parent: {}
    }
  },
  error: null,
};

describe('provider reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_PROVIDER_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchProvider())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_PROVIDER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDER_FULFILLED,
        payload: { ...initialState.provider, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      provider: { ...initialState.provider, id: 1 },
    });
  });

  it('should handle FETCH_PROVIDER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_PROVIDER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_PROVIDER_REQUEST', () => {
    expect(
      reducer({}, metaActions.createProvider())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_PROVIDER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_PROVIDER_FULFILLED,
        payload: { ...initialState.provider, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      provider: { ...initialState.provider, id: 1 },
    });
  });

  it('should handle CREATE_PROVIDER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_PROVIDER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
