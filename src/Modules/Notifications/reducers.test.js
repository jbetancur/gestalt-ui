import reducer from './reducers';
import * as types from './actionTypes';

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        queue: [],
      }
    );
  });

  it('should handle ADD_NOTIFICATION', () => {
    expect(
      reducer({ queue: [] }, {
        type: types.ADD_NOTIFICATION,
        message: { message: 'hi' },
      })
    ).toEqual({
      queue: [{ id: 0, message: 'hi' }],
    });
  });

  it('should handle ADD_NOTIFICATION', () => {
    expect(
      reducer({ queue: [{ id: 1, message: 'hi' }, { id: 2, message: 'ho' }] }, {
        type: types.CLEAR_OLDEST_MESSAGE,
      })
    ).toEqual({
      queue: [{ id: 2, message: 'ho' }],
    });
  });

  it('should handle REMOVE_NOTIFICATION', () => {
    expect(
      reducer({ queue: [{ message: 'hi' }] }, {
        type: types.REMOVE_NOTIFICATION,
        message: { message: 'hi' },
      })
    ).toEqual({
      queue: [],
    });
  });
});
