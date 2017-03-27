import { metaActions } from 'modules/MetaResource';
import * as actions from '../actions';
import reducer from './currentEnvironmentContext';

const initialState = {
  environment: {
    org: {},
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
};

describe('currentEnvironmentContext reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState);
  });

  it('should handle UNLOAD_CURRENT_ENVIRONMENT_CONTEXT and clear the state', () => {
    expect(
      reducer({}, actions.unloadEnvironmentContext())
    ).to.deep.equal(initialState);
  });


  it('should handle UPDATE_CURRENT_ENVIRONMENT_CONTEXT', () => {
    expect(
      reducer({}, metaActions.setCurrentEnvironmentContext({ ...initialState.environment, id: 1 }))
    ).to.deep.equal({
      environment: { ...initialState.environment, id: 1 },
    });
  });
});
