import * as actionTypes from '../actionTypes';
import * as actions from './organizations';

describe('Organization Actions', () => {
  it('should request FETCH_ALLORGS_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ALLORGS_REQUEST
    };

    expect(actions.fetchAllOrgs()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_ORGS_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ORGS_REQUEST
    };

    expect(actions.fetchOrgs()).to.deep.equal(expectedAction);
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
      routeToOrg: false,
    };

    expect(actions.createOrg('iamfqon', { id: 1 }, false)).to.deep.equal(expectedAction);
  });

  it('should request UPDATE_ORG_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_ORG_REQUEST,
      fqon: 'iamfqon',
      payload: [],
      routeToListing: false,
    };

    expect(actions.updateOrg('iamfqon', [], false)).to.deep.equal(expectedAction);
  });

  it('should request DELETE_ORG_REQUEST', () => {
    const expectedAction = {
      type: actionTypes.DELETE_ORG_REQUEST,
      fqon: 'iamfqon',
      options: {},
    };

    expect(actions.deleteOrg('iamfqon', {})).to.deep.equal(expectedAction);
  });
});
