import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './lambda';
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

describe('lambda reducer', () => {
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

  it('should handle FETCH_LAMBDA_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchLambda())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_LAMBDA_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDA_FULFILLED,
        payload: { ...initialState.lambda, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      lambda: { ...initialState.lambda, id: 1 },
    });
  });

  it('should handle FETCH_LAMBDA_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDA_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_LAMBDA_REQUEST', () => {
    expect(
      reducer({}, metaActions.createLambda())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_LAMBDA_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_LAMBDA_FULFILLED,
        payload: { ...initialState.lambda, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      lambda: { ...initialState.lambda, id: 1 },
    });
  });

  it('should handle CREATE_LAMBDA_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_LAMBDA_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
