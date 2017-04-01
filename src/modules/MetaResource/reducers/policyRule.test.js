import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './policyRule';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  policyRule: {
    created: {},
    modified: {},
    properties: {
      actions: [],
      eval_logic: {}
    }
  },
  error: null,
};


describe('policyRule reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ policyRule: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_POLICYRULE_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchPolicyRule())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_POLICYRULE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICYRULE_FULFILLED,
        payload: { ...initialState.policyRule, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policyRule: { ...initialState.policyRule, id: 1 },
    });
  });

  it('should handle FETCH_POLICYRULE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_POLICYRULE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_POLICYRULE_REQUEST', () => {
    expect(
      reducer({}, metaActions.createPolicyRule())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_POLICYRULE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_POLICYRULE_FULFILLED,
        payload: { ...initialState.policyRule, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policyRule: { ...initialState.policyRule, id: 1 },
    });
  });

  it('should handle CREATE_POLICYRULE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_POLICYRULE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
