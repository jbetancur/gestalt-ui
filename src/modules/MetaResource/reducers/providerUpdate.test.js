import * as types from '../actionTypes';
import reducer from './providerUpdate';
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
  error: null
};

describe('provider update reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UPDATE_PROVIDER_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateProvider())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_PROVIDER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_PROVIDER_FULFILLED,
        payload: { ...initialState.provider, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      provider: { ...initialState.provider, id: 1 },
    });
  });

  it('should handle UPDATE_PROVIDER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_PROVIDER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
