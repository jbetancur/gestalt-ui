import reducerFactory from './reducerFactory';

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
    ).toEqual(initialState);
  });

  describe('with basic options', () => {
    it('should handle REQUEST', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', []);

      expect(
        reducer({}, {
          type: 'metaResource/FETCH_YOUWANT_REQUEST',
        })
      ).toEqual({
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
      ).toEqual({
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
      ).toEqual({
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
      ).toEqual({
        pending: false,
        error: 'doh!',
      });
    });

    it('should handle UNLOAD_...', () => {
      const reducer = reducerFactory(['fetch'], 'whatever', 'youwant', []);

      expect(
        reducer({}, {
          type: 'metaResource/UNLOAD_YOUWANT',
        })
      ).toEqual(initialState);
    });
  });
});
