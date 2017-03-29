import * as types from '../actionTypes';
import reducer from './lambdas';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  lambdas: [],
  error: null
};

describe('lambds reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_LAMBDAS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchLambdas())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_LAMBDAS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDAS_FULFILLED,
        payload: [...initialState.lambdas, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      lambdas: [...initialState.lambdas, { id: 1 }],
    });
  });

  it('should handle FETCH_LAMBDAS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDAS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_LAMBDAS_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteLambdas())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_LAMBDA_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteLambda())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_LAMBDA_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_LAMBDA_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_LAMBDA_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_LAMBDA_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
