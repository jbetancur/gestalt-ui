import metaActions from '../actions';
import reducer from './currentOrgContext';

const initialState = {
  organization: {
    org: {
      properties: {},
    },
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
};

describe('currentOrgContext reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UPDATE_CURRENT_ORG_CONTEXT', () => {
    expect(
      reducer({}, metaActions.setCurrentOrgContext({ ...initialState.organization, id: 1 }))
    ).to.deep.equal({
      organization: { ...initialState.organization, id: 1 },
    });
  });
});
