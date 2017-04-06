import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './user';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  user: {
    created: {},
    modified: {},
    properties: {},
  },
  error: null,
};

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ user: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_USER_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchUser())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_USER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_USER_FULFILLED,
        payload: { ...initialState.user, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      user: { ...initialState.user, id: 1 },
    });
  });

  it('should handle FETCH_USER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_USER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_USER_REQUEST', () => {
    expect(
      reducer({}, metaActions.createUser())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_USER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_USER_FULFILLED,
        payload: { ...initialState.user, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      user: { ...initialState.user, id: 1 },
    });
  });

  it('should handle CREATE_USER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_USER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
