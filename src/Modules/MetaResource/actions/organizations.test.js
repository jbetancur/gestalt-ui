import * as actionTypes from '../actionTypes';
import * as actions from './organizations';

describe('Organization Actions', () => {
  it('should request UNLOAD_ORGANIZATION', () => {
    const expectedAction = {
      type: actionTypes.UNLOAD_ORGANIZATION,
    };

    expect(actions.unloadOrganization()).to.deep.equal(expectedAction);
  });


  it('should request FETCH_ALLORGS_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ALLORGS_REQUEST,
    };

    expect(actions.fetchAllOrgs()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ALLORGS_DROPDOWN_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ALLORGS_DROPDOWN_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchAllOrgsDropDown('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ORGS_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ORGS_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchOrgs('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ORG_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ORG_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchOrg('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ORGSET_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ORGSET_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchOrgSet('iamfqon')).to.deep.equal(expectedAction);
  });

  it('should request CREATE_ORG_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.CREATE_ORG_REQUEST,
      fqon: 'iamfqon',
      payload: { id: 1 },
      onSuccess: undefined,
    };

    expect(actions.createOrg('iamfqon', { id: 1 })).to.deep.equal(expectedAction);
  });

  it('should request UPDATE_ORG_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_ORG_REQUEST,
      fqon: 'iamfqon',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateOrg('iamfqon', [])).to.deep.equal(expectedAction);
  });

  it('should request DELETE_ORG_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.DELETE_ORG_REQUEST,
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteOrg('iamfqon')).to.deep.equal(expectedAction);
  });
});
