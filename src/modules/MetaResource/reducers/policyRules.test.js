import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './policyRules';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  policyRules: [],
  error: null,
};

describe('policyRules reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_POLICYRULES', () => {
    expect(
      reducer({ policyRules: [{ id: 1 }] }, metaActions.unloadPolicyRules())
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ policyRules: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_POLICYRULES_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchPolicyRules())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_POLICYRULES_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICYRULES_FULFILLED,
        payload: [...initialState.policyRules, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policyRules: [...initialState.policyRules, { id: 1 }],
    });
  });

  it('should handle FETCH_POLICYRULES_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICYRULES_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_POLICYRULES_REQUEST', () => {
    expect(
      reducer({}, metaActions.deletePolicyRules())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_POLICYRULE_REQUEST', () => {
    expect(
      reducer({}, metaActions.deletePolicyRule())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_POLICYRULE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_POLICYRULE_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_POLICYRULE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_POLICYRULE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
