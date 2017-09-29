import * as actionTypes from '../actionTypes';
import * as actions from './sync';

describe('Sync Actions', () => {
  it('should request FETCH_SYNC_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_SYNC_REQUEST
    };

    expect(actions.sync()).to.deep.equal(expectedAction);
  });
});
