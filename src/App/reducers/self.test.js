import * as metaTypes from 'modules/MetaResource/actionTypes';
import reducer from './self';

const initialState = {
  pending: false,
  completed: false,
  error: null,
  self: {
    properties: {
      gestalt_home: {
        org: {},
        created: {},
        modified: {},
        properties: {
          env: {}
        },
      }
    }
  }
};

describe('self reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_SELF_PENDING', () => {
    expect(
      reducer({}, {
        type: metaTypes.FETCH_SELF_PENDING,
      })
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_SELF_FULFILLED', () => {
    expect(
      reducer({}, {
        type: metaTypes.FETCH_SELF_FULFILLED,
        payload: { ...initialState.self, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      self: { ...initialState.self, id: 1 },
    });
  });

  it('should handle FETCH_SELF_REJECTED', () => {
    expect(
      reducer({}, {
        type: metaTypes.FETCH_SELF_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
