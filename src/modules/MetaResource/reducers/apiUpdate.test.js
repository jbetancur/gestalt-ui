import * as types from '../actionTypes';
import reducer from './apiUpdate';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  api: {
    created: {},
    modified: {},
    properties: {
      provider: {},
    }
  },
  error: null,
};

describe('api update reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UPDATE_API_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateAPI())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_API_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_API_FULFILLED,
        payload: { ...initialState.api, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      api: { ...initialState.api, id: 1 },
    });
  });

  it('should handle UPDATE_API_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_API_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
