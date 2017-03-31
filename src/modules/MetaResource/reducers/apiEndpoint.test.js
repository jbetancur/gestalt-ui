import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './apiEndpoint';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  apiEndpoint: {
    created: {},
    modified: {},
    properties: {
      auth_type: {},
    },
  },
  error: null,
};

describe('apiEndpoint reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ apiEndpoint: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_APIENDPOINT_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchAPIEndpoint())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_APIENDPOINT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_APIENDPOINT_FULFILLED,
        payload: { ...initialState.apiEndpoint, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      apiEndpoint: { ...initialState.apiEndpoint, id: 1 },
    });
  });

  it('should handle FETCH_APIENDPOINT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_APIENDPOINT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_APIENDPOINT_REQUEST', () => {
    expect(
      reducer({}, metaActions.createAPIEndpoint())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_APIENDPOINT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_APIENDPOINT_FULFILLED,
        payload: { ...initialState.apiEndpoint, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      apiEndpoint: { ...initialState.apiEndpoint, id: 1 },
    });
  });

  it('should handle CREATE_APIENDPOINT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_APIENDPOINT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
