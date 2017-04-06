import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';
import reducer from './allOrganizationsDropDown';
import { metaActions } from '../../MetaResource';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  error: null,
};

describe('allOrganizationsDropDown reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    expect(
      reducer({ organizations: [{ id: 1 }] }, { type: LOCATION_CHANGE })
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_ALLORGS', () => {
    expect(
      reducer({ organizations: [{ id: 1 }] }, metaActions.onUnloadAllOrgs())
    ).to.deep.equal(initialState);
  });

  it('should handle FETCH_ALLORGS_DROPDOWN_REQUEST', () => {
    expect(
      reducer({}, metaActions.fetchAllOrgsDropDown())
    ).to.deep.equal({
      pending: true,
      organizations: [{ name: 'fetching organizations...', value: '' }],
    });
  });

  it('should handle FETCH_ALLORGS_DROPDOWN_FULFILLED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ALLORGS_DROPDOWN_FULFILLED,
        payload: [...initialState.organizations, { id: 1 }],
      })
    ).to.deep.equal({
      pending: false,
      completed: true,
      organizations: [...initialState.organizations, { id: 1 }],
    });
  });

  it('should handle FETCH_ALLORGS_DROPDOWN_REJECTED', () => {
    expect(
      reducer({}, {
        type: types.FETCH_ALLORGS_DROPDOWN_REJECTED,
        payload: 'doh!',
      })
    ).to.deep.equal({
      pending: false,
      error: 'doh!',
    });
  });
});
