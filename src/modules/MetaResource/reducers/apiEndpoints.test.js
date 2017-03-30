import * as types from '../actionTypes';
import reducer from './apiEndpoints';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  apiEndpoints: [],
  error: null,
};
describe('apiEndpoints reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_APIENDPOINTS_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchAPIEndpoints())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_APIENDPOINTS_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_APIENDPOINTS_FULFILLED,
        payload: [...initialState.apiEndpoints, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      apiEndpoints: [...initialState.apiEndpoints, { id: 1 }],
    });
  });

  it('should handle FETCH_APIENDPOINTS_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_APIENDPOINTS_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_APIENDPOINTS_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteAPIEndpoints())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_APIENDPOINT_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteAPIEndpoint())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_APIENDPOINT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_APIENDPOINT_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_APIENDPOINT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_APIENDPOINT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
