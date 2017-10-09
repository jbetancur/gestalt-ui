import { combineReducers } from 'redux';
import currentOrgContext from './currentOrgContext';
import currentWorkspaceContext from './currentWorkspaceContext';
import currentEnvironmentContext from './currentEnvironmentContext';

export default combineReducers({
  currentOrgContext,
  currentWorkspaceContext,
  currentEnvironmentContext,
});
