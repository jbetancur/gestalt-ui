import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './env';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  env: {},
  error: null
};


describe('env reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ env: { test: 'var' } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ENV_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchEnv())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ENV_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENV_FULFILLED,
        payload: { ...initialState.env, },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      env: { ...initialState.env, },
    });
  });

  it('should handle FETCH_ENV_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENV_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
