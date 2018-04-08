import * as actionTypes from '../actionTypes';
import * as actions from './self';

describe('Self Actions', () => {
  it('should request FETCH_SELF_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_SELF_REQUEST
    };

    expect(actions.fetchSelf()).toEqual(expectedAction);
  });
});
