import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './groupMembers';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  group: {
    created: {},
    modified: {},
    properties: {
      users: [],
    },
  },
  error: null,
};

describe('groupMembers reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ group: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle ADD_GROUP_MEMBER_REQUEST', () => {
    expect(
      reducer({}, metaActions.addGroupMember())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle ADD_GROUP_MEMBER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.ADD_GROUP_MEMBER_FULFILLED,
        payload: { ...initialState.group, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      group: { ...initialState.group, id: 1 },
    });
  });

  it('should handle ADD_GROUP_MEMBER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.ADD_GROUP_MEMBER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle REMOVE_GROUP_MEMBER_REQUEST', () => {
    expect(
      reducer({}, metaActions.removeGroupMember())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle REMOVE_GROUP_MEMBER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.REMOVE_GROUP_MEMBER_FULFILLED,
        payload: { ...initialState.group, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      group: { ...initialState.group, id: 1 },
    });
  });

  it('should handle REMOVE_GROUP_MEMBER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.REMOVE_GROUP_MEMBER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
