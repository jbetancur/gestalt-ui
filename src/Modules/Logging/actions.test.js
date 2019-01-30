import {
  FETCH_LOGPROVIDER_REQUEST,
} from './actionTypes';
import * as actions from './actions';

describe('Logging Actions', () => {
  it('should request FETCH_LOGPROVIDER_REQUEST', () => {
    const expectedAction = {
      type: FETCH_LOGPROVIDER_REQUEST,
      fqon: 'iamfqon',
      providerId: '1',
      logType: 'poopy',
    };

    expect(actions.fetchLogProvider('iamfqon', '1', 'poopy')).toEqual(expectedAction);
  });
});
