import * as actionTypes from '../actionTypes';
import * as actions from './users';

describe('Context Actions', () => {
  it('should request FETCH_SELF_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_SELF_REQUEST
    };

    expect(actions.fetchSelf()).to.deep.equal(expectedAction);
  });
});
