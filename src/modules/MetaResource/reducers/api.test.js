import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './api';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  api: {
    created: {},
    modified: {},
    properties: {
      provider: {},
    }
  },
  error: null,
};

describe('api reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ api: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_API_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchAPI())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_API_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_API_FULFILLED,
        payload: { ...initialState.api, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      api: { ...initialState.api, id: 1 },
    });
  });

  it('should handle FETCH_API_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_API_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_API_REQUEST', () => {
    expect(
      reducer({}, metaActions.createAPI())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_API_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_API_FULFILLED,
        payload: { ...initialState.api, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      api: { ...initialState.api, id: 1 },
    });
  });

  it('should handle CREATE_API_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_API_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
