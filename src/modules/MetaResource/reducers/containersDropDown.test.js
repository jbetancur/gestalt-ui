import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './containersDropDown';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  containers: [],
  error: null,
};

describe('containersDropDown reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ containers: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_CONTAINERS_DROPDOWN_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchContainersDropDown())
    ).to.deep.equal({
      pending: true,
      containers: [{ id: '', name: 'fetching containers...' }],
    });
  });

  it('should handle FETCH_CONTAINERS_DROPDOWN_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_CONTAINERS_DROPDOWN_FULFILLED,
        payload: [...initialState.containers, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      containers: [...initialState.containers, { id: 1 }],
    });
  });

  it('should handle FETCH_CONTAINERS_DROPDOWN_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_CONTAINERS_DROPDOWN_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
