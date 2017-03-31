import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './containers';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  containers: [],
  error: null,
};

describe('containers reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_CONTAINERS', () => {
    expect(
      reducer({ containers: [{ id: 1 }] }, metaActions.unloadContainers())
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ containers: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_CONTAINERS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchContainers())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_CONTAINERS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_CONTAINERS_FULFILLED,
        payload: [...initialState.containers, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      containers: [...initialState.containers, { id: 1 }],
    });
  });

  it('should handle FETCH_CONTAINERS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_CONTAINERS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
