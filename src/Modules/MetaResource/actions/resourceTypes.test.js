import * as types from '../actionTypes';
import * as actions from './resourceTypes';

describe('Resource Type Actions', () => {
  it('should request UNLOAD_RESOURCETYPES', () => {
    const expectedAction = {
      type: types.UNLOAD_RESOURCETYPES,
    };

    expect(actions.unloadResourceTypes()).toEqual(expectedAction);
  });

  it('should request UNLOAD_RESOURCETYPE', () => {
    const expectedAction = {
      type: types.UNLOAD_RESOURCETYPE,
    };

    expect(actions.unloadResourceType()).toEqual(expectedAction);
  });

  it('should request FETCH_RESOURCETYPES_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_RESOURCETYPES_REQUEST,
      fqon: 'iamfqon',
      filter: undefined,
    };

    expect(actions.fetchResourceTypes('iamfqon')).toEqual(expectedAction);
  });

  it('should request FETCH_RESOURCETYPES_DROPDOWN_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_RESOURCETYPES_DROPDOWN_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchResourceTypesDropDown('iamfqon')).toEqual(expectedAction);
  });

  it('should request FETCH_RESOURCETYPE_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_RESOURCETYPE_REQUEST,
      fqon: 'iamfqon',
      resourceTypeId: '1',
    };

    expect(actions.fetchResourceType('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should request CREATE_RESOURCETYPE_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_RESOURCETYPE_REQUEST,
      fqon: 'iamfqon',
      payload: { name: 'woop woop!' },
      onSuccess: undefined,
    };

    expect(actions.createResourceType('iamfqon', { name: 'woop woop!' })).toEqual(expectedAction);
  });

  it('should handle UPDATE_RESOURCETYPE_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_RESOURCETYPE_REQUEST,
      fqon: 'iamfqon',
      resourceTypeId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateResourceType('iamfqon', '1', [])).toEqual(expectedAction);
  });

  it('should handle DELETE_RESOURCETYPE_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_RESOURCETYPE_REQUEST,
      fqon: 'iamfqon',
      resourceTypeId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteResourceType('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should handle DELETE_RESOURCETYPES_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_RESOURCETYPES_REQUEST,
      resourceTypeIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteResourceTypes([], 'iamfqon')).toEqual(expectedAction);
  });
});
