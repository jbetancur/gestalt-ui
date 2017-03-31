import * as types from '../actionTypes';
import reducer from './environments';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  environments: [],
  error: null,
};

describe('environments reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ENVIRONMENTS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchEnvironments())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ENVIRONMENTS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENVIRONMENTS_FULFILLED,
        payload: [...initialState.environments, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      environments: [...initialState.environments, { id: 1 }],
    });
  });

  it('should handle FETCH_ENVIRONMENTS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENVIRONMENTS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
