import * as types from '../actionTypes';
import reducer from './environment';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  environment: {
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {},
      workspace: {},
    }
  },
  error: null
};

describe('environment reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_ENVIRONMENT', () => {
    expect(
      reducer({}, metaActions.onUnloadEnvironment())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ENVIRONMENT_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchEnvironment())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ENVIRONMENT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENVIRONMENT_FULFILLED,
        payload: { ...initialState.environment, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      environment: { ...initialState.environment, id: 1 },
    });
  });

  it('should handle FETCH_ENVIRONMENT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ENVIRONMENT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_ENVIRONMENT_REQUEST', () => {
    expect(
      reducer({}, metaActions.createEnvironment())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_ENVIRONMENT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_ENVIRONMENT_FULFILLED,
        payload: { ...initialState.environment, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      environment: { ...initialState.environment, id: 1 },
    });
  });

  it('should handle CREATE_ENVIRONMENT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_ENVIRONMENT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle UPDATE_ENVIRONMENT_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateEnvironment())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_ENVIRONMENT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_ENVIRONMENT_FULFILLED,
        payload: { ...initialState.environment, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      environment: { ...initialState.environment, id: 1 },
    });
  });

  it('should handle UPDATE_ENVIRONMENT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_ENVIRONMENT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_ENVIRONMENT_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteEnvironment())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_ENVIRONMENT_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_ENVIRONMENT_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_ENVIRONMENT_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_ENVIRONMENT_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
