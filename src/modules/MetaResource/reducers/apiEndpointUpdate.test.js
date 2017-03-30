import * as types from '../actionTypes';
import reducer from './apiEndpointUpdate';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  apiendpoint: {
    created: {},
    modified: {},
    properties: {
      auth_type: {},
    },
  },
  error: null,
};

describe('apiEndpoint update reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UPDATE_APIENDPOINT_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateAPIEndpoint())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_APIENDPOINT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_APIENDPOINT_FULFILLED,
        payload: { ...initialState.apiEndpoint, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      apiEndpoint: { ...initialState.apiEndpoint, id: 1 },
    });
  });

  it('should handle UPDATE_APIENDPOINT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_APIENDPOINT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
