import { combineReducers } from 'redux';

import self from './self';
import currentOrgContext from './currentOrgContext';
import currentWorkspaceContext from './currentWorkspaceContext';
import currentEnvironmentContext from './currentEnvironmentContext';

export default combineReducers({
  self,
  currentOrgContext,
  currentWorkspaceContext,
  currentEnvironmentContext,
});
