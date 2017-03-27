import * as actionTypes from '../actionTypes';
import reducer from './activityIndicator';

const initialState = {
  activity: false,
};

describe('currentWorkspaceContext reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle APP_HTTP_REQUEST', () => {
    expect(
      reducer({}, {
        type: actionTypes.APP_HTTP_REQUEST,
        activity: true,
      })
    ).to.deep.equal({
      activity: true,
    });
  });
});
