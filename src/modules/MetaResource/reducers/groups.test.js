import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './groups';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  groups: [],
  error: null,
};

describe('groups reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_GROUPS', () => {
    expect(
      reducer({ groups: [{ id: 1 }] }, metaActions.unloadGroups())
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ groups: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_GROUPS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchGroups())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_GROUPS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_GROUPS_FULFILLED,
        payload: [...initialState.groups, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      groups: [...initialState.groups, { id: 1 }],
    });
  });

  it('should handle FETCH_GROUPS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_GROUPS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_GROUPS_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteGroups())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_GROUP_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteGroup())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_GROUP_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_GROUP_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_GROUP_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_GROUP_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
