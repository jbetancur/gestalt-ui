import {
  CREATE_TYPEPROPERTY_REQUEST,
  UPDATE_TYPEPROPERTY_REQUEST,
  DELETE_TYPEPROPERTY_REQUEST,
  BATCH_UPDATE_TYPEPROPERTY_REQUEST,
} from './constants';
import * as actions from './actions';

describe('Type Properties Actions', () => {
  it('should request CREATE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: CREATE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      resourceTypeId: '1',
      payload: { name: 'woop woop!' },
      onSuccess: undefined,
    };

    expect(actions.createTypeProperty('iamfqon', '1', { name: 'woop woop!' })).toEqual(expectedAction);
  });

  it('should handle UPDATE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: UPDATE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      typePropertyId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateTypeProperty('iamfqon', '1', [])).toEqual(expectedAction);
  });

  it('should handle DELETE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: DELETE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      typePropertyId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteTypeProperty('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should handle BATCH_UPDATE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: BATCH_UPDATE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      operations: [],
      onSuccess: undefined,
    };

    expect(actions.batchUpdateTypeProperties('iamfqon', [])).toEqual(expectedAction);
  });
});
