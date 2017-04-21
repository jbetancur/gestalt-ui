import { LOCATION_CHANGE } from 'react-router-redux';
import reducerFactory from './asyncReducerFactory';

const initialState = {
  pending: false,
  completed: false,
  whatever: [],
  error: null,
};

describe('reducerFactory', () => {
  it('should return the default state when there is no matching Action Type', () => {
    const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', []);

    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  describe('with basic options', () => {
    it('should handle REQUEST', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', []);

      expect(
        reducer({}, {
          type: 'metaResource/FETCH_YOUWANT_REQUEST',
        })
      ).to.deep.equal({
        pending: true,
      });
    });

    it('should handle FULFILLED', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', []);

      expect(
        reducer({}, {
          type: 'metaResource/FETCH_YOUWANT_FULFILLED',
          payload: [...initialState.whatever, { id: 1 }],
        })
      ).to.deep.equal({
        pending: false,
        completed: true,
        whatever: [...initialState.whatever, { id: 1 }],
      });
    });

    it('should handle FULFILLED when there is a delete verb', () => {
      const reducer = reducerFactory(['delete'], 'whatever', 'youwant', []);

      expect(
        reducer({}, {
          type: 'metaResource/DELETE_YOUWANT_FULFILLED',
        })
      ).to.deep.equal({
        pending: false,
        completed: true,
      });
    });

    it('should handle REJECTED', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', []);

      expect(
        reducer({}, {
          type: 'metaResource/FETCH_YOUWANT_REJECTED',
          payload: 'doh!',
        })
      ).to.deep.equal({
        pending: false,
        error: 'doh!',
      });
    });

    it('should handle UNLOAD_...', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', [], true);

      expect(
        reducer({}, {
          type: 'UNLOAD_YOUWANT',
        })
      ).to.deep.equal(initialState);
    });
  });

  describe('with clearStateOnRouteChange options', () => {
    it('should handle LOCATION_CHANGE', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', [], true);

      expect(
        reducer({}, {
          type: LOCATION_CHANGE,
        })
      ).to.deep.equal(initialState);
    });
  });

  describe('with customRequestState options', () => {
    it('should handle LOCATION_CHANGE', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', [], false, [{ name: 'test' }]);

      expect(
        reducer({}, {
          type: 'metaResource/FETCH_YOUWANT_REQUEST',
        })
      ).to.deep.equal({
        pending: true,
        whatever: [{ name: 'test' }],
      });
    });
  });
});
