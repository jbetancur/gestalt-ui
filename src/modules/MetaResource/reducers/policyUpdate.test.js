import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './policyUpdate';
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

describe('policy update reducer', () => {
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

  it('should handle UPDATE_POLICY_REQUEST', () => {
    expect(
      reducer({}, metaActions.updatePolicy())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_POLICY_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_POLICY_FULFILLED,
        payload: { ...initialState.policy, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policy: { ...initialState.policy, id: 1 },
    });
  });

  it('should handle UPDATE_POLICY_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_POLICY_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
