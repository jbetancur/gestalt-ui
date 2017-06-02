import { combineReducers } from 'redux';

import workspaceContextNavigation from './workspaceNavigation';
import environmentContextNavigation from './environmentNavigation';

export default combineReducers({
  workspaceContextNavigation,
  environmentContextNavigation,
});
