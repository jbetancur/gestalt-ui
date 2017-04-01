import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './policies';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  policies: [],
  error: null,
};

describe('policies reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_POLICIES', () => {
    expect(
      reducer({ policies: [{ id: 1 }] }, metaActions.unloadPolicies())
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ policies: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_POLICIES_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchPolicies())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_POLICIES_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICIES_FULFILLED,
        payload: [...initialState.policies, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policies: [...initialState.policies, { id: 1 }],
    });
  });

  it('should handle FETCH_POLICIES_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICIES_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_POLICIES_REQUEST', () => {
    expect(
      reducer({}, metaActions.deletePolicies())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_POLICY_REQUEST', () => {
    expect(
      reducer({}, metaActions.deletePolicy())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_POLICY_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_POLICY_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_POLICY_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_POLICY_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
