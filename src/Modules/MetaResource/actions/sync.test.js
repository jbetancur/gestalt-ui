import * as actionTypes from '../actionTypes';
import * as actions from './sync';

describe('Sync Actions', () => {
  it('should request CREATE_SYNC_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.CREATE_SYNC_REQUEST
    };

    expect(actions.sync()).toEqual(expectedAction);
  });
});
