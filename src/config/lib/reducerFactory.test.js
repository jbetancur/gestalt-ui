import { LOCATION_CHANGE } from 'connected-react-router';
import reducerFactory from './reducerFactory';
import { PREFIX } from '../../constants';

const initialState = {
  pending: false,
  completed: false,
  whatever: [],
  error: null,
};

describe('reducerFactory', () => {
  it('should return the default state when there is no matching Action Type', () => {
    const reducer = reducerFactory({ verbs: ['fetch'], key: 'whatever', category: 'youwant', model: [] });

    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('with basic options', () => {
    it('should handle REQUEST', () => {
      const reducer = reducerFactory({ verbs: ['fetch'], key: 'whatever', category: 'youwant', model: [] });

      expect(
        reducer({}, {
          type: `${PREFIX}FETCH_YOUWANT_REQUEST`,
        })
      ).toEqual({
        pending: true,
      });
    });

    it('should handle FULFILLED', () => {
      const reducer = reducerFactory({ verbs: ['fetch'], key: 'whatever', category: 'youwant', model: [] });

      expect(
        reducer({}, {
          type: `${PREFIX}FETCH_YOUWANT_FULFILLED`,
          payload: [...initialState.whatever, { id: 1 }],
        })
      ).toEqual({
        pending: false,
        completed: true,
        whatever: [...initialState.whatever, { id: 1 }],
      });
    });

    it('should handle FULFILLED when there is a delete verb', () => {
      const reducer = reducerFactory({ verbs: ['delete'], key: 'whatever', category: 'youwant', model: [] });

      expect(
        reducer({}, {
          type: `${PREFIX}DELETE_YOUWANT_FULFILLED`,
        })
      ).toEqual({
        pending: false,
        completed: true,
      });
    });

    it('should handle REJECTED', () => {
      const reducer = reducerFactory({ verbs: ['fetch'], key: 'whatever', category: 'youwant', model: [] });

      expect(
        reducer({}, {
          type: `${PREFIX}FETCH_YOUWANT_REJECTED`,
          payload: 'doh!',
        })
      ).toEqual({
        pending: false,
        error: 'doh!',
      });
    });

    it('should handle UNLOAD_...', () => {
      const reducer = reducerFactory({ verbs: ['fetch'], key: 'whatever', category: 'youwant', model: [] });

      expect(
        reducer({}, {
          type: `${PREFIX}UNLOAD_YOUWANT`,
        })
      ).toEqual(initialState);
    });

    it('should unload state on LOCATION_CHANGE when unloadOnRouteChange is true', () => {
      const reducer = reducerFactory({ verbs: ['fetch'], key: 'whatever', category: 'youwant', model: [], unloadOnRouteChange: true });

      expect(
        reducer({}, {
          type: LOCATION_CHANGE,
        })
      ).toEqual(initialState);
    });
  });
});
