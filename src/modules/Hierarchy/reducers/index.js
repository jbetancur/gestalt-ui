import { combineReducers } from 'redux';

import hierarchyContextNavigation from './hierarchyNavigation';
import workspaceContextNavigation from './workspaceNavigation';
import environmentContextNavigation from './environmentNavigation';

export default combineReducers({
  hierarchyContextNavigation,
  workspaceContextNavigation,
  environmentContextNavigation,
});
