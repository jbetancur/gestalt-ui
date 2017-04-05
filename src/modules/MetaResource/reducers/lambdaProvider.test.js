import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './lambdaProvider';
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
        networks: [],
      },
      linked_providers: [],
      locations: [],
      parent: {}
    }
  },
  error: null,
};

describe('lambdaProvider reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ provider: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_LAMBDA_PROVIDER_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchLambdaProvider())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_LAMBDA_PROVIDER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDA_PROVIDER_FULFILLED,
        payload: { ...initialState.provider, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      provider: { ...initialState.provider, id: 1 },
    });
  });

  it('should handle FETCH_LAMBDA_PROVIDER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDA_PROVIDER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
