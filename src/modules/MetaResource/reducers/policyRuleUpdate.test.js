import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './policyRuleUpdate';
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

describe('policyRule update reducer', () => {
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

  it('should handle UPDATE_POLICYRULE_REQUEST', () => {
    expect(
      reducer({}, metaActions.updatePolicyRule())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_POLICYRULE_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_POLICYRULE_FULFILLED,
        payload: { ...initialState.policyRule, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      policyRule: { ...initialState.policyRule, id: 1 },
    });
  });

  it('should handle UPDATE_POLICYRULE_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_POLICYRULE_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
