import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './policy';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  policy: {
    created: {},
    modified: {},
    properties: {}
  },
  error: null,
};

describe('policy reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ policy: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_POLICY_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchPolicy())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_POLICY_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICY_FULFILLED,
        payload: { ...initialState.policy, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policy: { ...initialState.policy, id: 1 },
    });
  });

  it('should handle FETCH_POLICY_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICY_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_POLICY_REQUEST', () => {
    expect(
      reducer({}, metaActions.createPolicy())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_POLICY_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_POLICY_FULFILLED,
        payload: { ...initialState.policy, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policy: { ...initialState.policy, id: 1 },
    });
  });

  it('should handle CREATE_POLICY_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_POLICY_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
