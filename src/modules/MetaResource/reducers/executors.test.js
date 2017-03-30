import * as types from '../actionTypes';
import reducer from './executors';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  executors: [],
  error: null,
};

describe('executors reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_EXECUTORS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchExecutors())
    ).to.deep.equal({
      pending: true,
      executors: [{ id: '', name: 'fetching executors...' }],
    });
  });

  it('should handle FETCH_EXECUTORS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_EXECUTORS_FULFILLED,
        payload: [...initialState.executors, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      executors: [...initialState.executors, { id: 1 }],
    });
  });

  it('should handle FETCH_EXECUTORS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_EXECUTORS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
