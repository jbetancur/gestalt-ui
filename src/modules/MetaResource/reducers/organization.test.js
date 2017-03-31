import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './organization';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  organization: {
    org: {},
    created: {},
    modified: {},
    owner: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

describe('organization reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ organization: { id: 1 } }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ORG_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchOrg())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle FETCH_ORG_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ORG_FULFILLED,
        payload: { ...initialState.organization, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organization: { ...initialState.organization, id: 1 },
    });
  });

  it('should handle FETCH_ORG_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ORG_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle CREATE_ORG_REQUEST', () => {
    expect(
      reducer({}, metaActions.createOrg())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle CREATE_ORG_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_ORG_FULFILLED,
        payload: { ...initialState.organization, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organization: { ...initialState.organization, id: 1 },
    });
  });

  it('should handle CREATE_ORG_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.CREATE_ORG_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle UPDATE_ORG_REQUEST', () => {
    expect(
      reducer({}, metaActions.updateOrg())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle UPDATE_ORG_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_ORG_FULFILLED,
        payload: { ...initialState.organization, id: 1 },
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organization: { ...initialState.organization, id: 1 },
    });
  });

  it('should handle UPDATE_ORG_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.UPDATE_ORG_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });

  it('should handle DELETE_ORG_REQUEST', () => {
    expect(
      reducer({}, metaActions.deleteOrg())
    ).to.deep.equal({
      pending: true,
    });
  });

  it('should handle DELETE_ORG_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_ORG_FULFILLED,
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
    });
  });

  it('should handle DELETE_ORG_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.DELETE_ORG_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
