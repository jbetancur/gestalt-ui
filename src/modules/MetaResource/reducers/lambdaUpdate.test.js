import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './lambdaUpdate';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  lambda: {
    created: {},
    modified: {},
    properties: {
      env: {},
      headers: {},
      providers: [],
      periodic_info: {
        payload: {},
      },
    },
  },
  error: null
};

describe('lambda update reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ lambda: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle UPDATE_LAMBDA_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateLambda())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_LAMBDA_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_LAMBDA_FULFILLED,
        payload: { ...initialState.lambda, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      lambda: { ...initialState.lambda, id: 1 },
    });
  });

  it('should handle UPDATE_LAMBDA_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_LAMBDA_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
