import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './envSchema';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  public: [],
  private: [],
  error: null,
};

describe('env schema reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ public: [{ pubvar: 'varpub' }], private: [{ privatevar: 'varprivate' }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ENV_SCHEMA_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchEnvSchema())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ENV_SCHEMA_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENV_SCHEMA_FULFILLED,
        payload: { public: [{ pubvar: 'varpub' }], private: [{ privatevar: 'varprivate' }] },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      public: [{ pubvar: 'varpub' }],
      private: [{ privatevar: 'varprivate' }],
    });
  });

  it('should handle FETCH_ENV_SCHEMA_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENV_SCHEMA_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
