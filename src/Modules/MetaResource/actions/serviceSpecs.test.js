import * as types from '../actionTypes';
import * as actions from './serviceSpecs';

describe('Services Actions', () => {
  it('should request UNLOAD_SERVICESPECS', () => {
    const expectedAction = {
      type: types.UNLOAD_SERVICESPECS,
    };

    expect(actions.unloadServiceSpecs()).toEqual(expectedAction);
  });

  it('should request FETCH_SERVICESPECS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_SERVICESPECS_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchServiceSpecs('iamfqon')).toEqual(expectedAction);
  });

  it('should request FETCH_SERVICESPECS_DROPDOWN_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_SERVICESPECS_DROPDOWN_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchServiceSpecsDropdown('iamfqon')).toEqual(expectedAction);
  });

  it('should handle CREATE_SERVICESPEC_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_SERVICESPEC_REQUEST,
      fqon: 'iamfqon',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createServiceSpec('iamfqon', { name: 'test' })).toEqual(expectedAction);
  });
});
