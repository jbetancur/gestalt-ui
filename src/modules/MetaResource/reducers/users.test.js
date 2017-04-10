import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './users';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  users: [],
  error: null,
};

describe('users reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_USERS', () => {
    expect(
      reducer({ users: [{ id: 1 }] }, metaActions.unloadUsers())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_USERS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchUsers())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_USERS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_USERS_FULFILLED,
        payload: [...initialState.users, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      users: [...initialState.users, { id: 1 }],
    });
  });

  it('should handle FETCH_USERS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_USERS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_USERS_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteUsers())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_USER_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteUser())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_USER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_USER_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_USER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_USER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
