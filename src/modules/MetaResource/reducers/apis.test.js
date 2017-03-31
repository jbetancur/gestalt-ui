import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './apis';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  apis: [],
  error: null,
};

describe('apis reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should return the initial state on UNLOAD_APIS', () => {
    expect(
      reducer({ apis: [{ id: 1 }] }, metaActions.unloadAPIs())
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ apis: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_APIS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchAPIs())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_APIS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_APIS_FULFILLED,
        payload: [...initialState.apis, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      apis: [...initialState.apis, { id: 1 }],
    });
  });

  it('should handle FETCH_APIS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_APIS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_APIS_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteAPIs())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_API_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteAPI())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_API_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_API_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_API_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_API_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
