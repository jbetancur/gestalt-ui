import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './container';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  container: {
    created: {},
    modified: {},
    properties: {
      env: {},
      accepted_resource_roles: [],
      constraints: [],
      health_checks: [],
      instances: [],
      port_mappings: [],
      service_addresses: [],
      volumes: [],
      provider: {},
      force_pull: false,
    },
  },
  error: null,
};

describe('container reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ container: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_PROVIDER_CONTAINER_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchProviderContainer())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_CONTAINER_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchContainer())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_CONTAINER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_CONTAINER_FULFILLED,
        payload: { ...initialState.container, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      container: { ...initialState.container, id: 1 },
    });
  });

  it('should handle FETCH_CONTAINER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_CONTAINER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_CONTAINER_REQUEST', () => {
    expect(
      reducer({}, metaActions.createContainer())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_CONTAINER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_CONTAINER_FULFILLED,
        payload: { ...initialState.container, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      container: { ...initialState.container, id: 1 },
    });
  });

  it('should handle CREATE_CONTAINER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_CONTAINER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_CONTAINER_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteContainer())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_CONTAINER_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_CONTAINER_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_CONTAINER_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_CONTAINER_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
