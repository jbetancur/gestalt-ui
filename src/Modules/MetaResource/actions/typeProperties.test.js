import * as types from '../actionTypes';
import * as actions from './typeProperties';

describe('Type Properties Actions', () => {
  it('should request CREATE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      resourceTypeId: '1',
      payload: { name: 'woop woop!' },
      onSuccess: undefined,
    };

    expect(actions.createTypeProperty('iamfqon', '1', { name: 'woop woop!' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      typePropertyId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateTypeProperty('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      typePropertyId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteTypeProperty('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle BATCH_UPDATE_TYPEPROPERTY_REQUEST', () => {
    const expectedAction = {
      type: types.BATCH_UPDATE_TYPEPROPERTY_REQUEST,
      fqon: 'iamfqon',
      operations: [],
      onSuccess: undefined,
    };

    expect(actions.batchUpdateTypeProperties('iamfqon', [])).to.deep.equal(expectedAction);
  });
});
