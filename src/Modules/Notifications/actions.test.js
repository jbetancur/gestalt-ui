import * as types from './actionTypes';
import * as actions from './actions';

describe('Notification Actions Creators', () => {
  it('should request ADD_NOTIFICATION', () => {
    const expectedAction = {
      type: types.ADD_NOTIFICATION,
      message: {
        message: 'morty',
      }
    };

    expect(actions.addNotification({ message: 'morty' })).toEqual(expectedAction);
  });

  it('should request REMOVE_NOTIFICATION', () => {
    const expectedAction = {
      type: types.REMOVE_NOTIFICATION,
      message: {
        message: 'morty',
      }
    };

    expect(actions.removeNotification({ message: 'morty' })).toEqual(expectedAction);
  });
});
