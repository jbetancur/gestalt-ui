import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './groupUpdate';
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

describe('groupUpdate reducer', () => {
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

  it('should handle UPDATE_GROUP_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateGroup())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_GROUP_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_GROUP_FULFILLED,
        payload: { ...initialState.group, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      group: { ...initialState.group, id: 1 },
    });
  });

  it('should handle UPDATE_GROUP_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_GROUP_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
