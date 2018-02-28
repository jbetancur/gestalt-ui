import * as types from '../actionTypes';
import * as actions from './lambdas';

describe('Lambda Actions', () => {
  it('should request UNLOAD_LAMBDAS', () => {
    const expectedAction = {
      type: types.UNLOAD_LAMBDAS,
    };

    expect(actions.unloadLambdas()).to.deep.equal(expectedAction);
  });

  it('should request UNLOAD_LAMBDA', () => {
    const expectedAction = {
      type: types.UNLOAD_LAMBDA,
    };

    expect(actions.unloadLambda()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_LAMBDAS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_LAMBDAS_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchLambdas('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_LAMBDAS_DROPDOWN_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_LAMBDAS_DROPDOWN_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
    };

    expect(actions.fetchLambdasDropDown('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_LAMBDA_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_LAMBDA_REQUEST,
      fqon: 'iamfqon',
      lambdaId: '1',
    };

    expect(actions.fetchLambda('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_LAMBDA_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_LAMBDA_REQUEST,
      fqon: 'iamfqon',
      environmentId: '1',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createLambda('iamfqon', '1', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_LAMBDA_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_LAMBDA_REQUEST,
      fqon: 'iamfqon',
      lambdaId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateLambda('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_LAMBDA_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_LAMBDA_REQUEST,
      fqon: 'iamfqon',
      lambdaId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteLambda('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_LAMBDAS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_LAMBDAS_REQUEST,
      lambdaIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteLambdas([], 'iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_LAMBDA_PROVIDER_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_LAMBDA_PROVIDER_REQUEST,
      fqon: 'iamfqon',
      lambdaId: '1',
    };

    expect(actions.fetchLambdaProvider('iamfqon', '1')).to.deep.equal(expectedAction);
  });
});
