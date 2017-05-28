import * as types from '../actionTypes';
import * as actions from './logging';

describe('Logging Actions', () => {
  it('should request FETCH_LOGPROVIDER_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_LOGPROVIDER_REQUEST,
      fqon: 'iamfqon',
      providerId: '1',
      logType: 'poopy',
    };

    expect(actions.fetchLogProvider('iamfqon', '1', 'poopy')).to.deep.equal(expectedAction);
  });
});
