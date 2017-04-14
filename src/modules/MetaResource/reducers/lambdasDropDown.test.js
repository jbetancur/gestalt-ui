import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './lambdasDropDown';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  lambdas: [],
  error: null,
};

describe('lambdasDropDown reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ lambdas: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_LAMBDAS_DROPDOWN_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchLambdasDropDown())
    ).to.deep.equal({
      pending: true,
      lambdas: [{ id: '', name: 'fetching lambdas...' }],
    });
  });

  it('should handle FETCH_LAMBDAS_DROPDOWN_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDAS_DROPDOWN_FULFILLED,
        payload: [...initialState.lambdas, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      lambdas: [...initialState.lambdas, { id: 1 }],
    });
  });

  it('should handle FETCH_LAMBDAS_DROPDOWN_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_LAMBDAS_DROPDOWN_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
