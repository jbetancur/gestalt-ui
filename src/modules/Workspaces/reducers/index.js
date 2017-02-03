import { combineReducers } from 'redux';

import fetchAll from './workspaces';
import fetchOne from './workspace';
import navigation from './navigation';

export default combineReducers({
  fetchAll,
  fetchOne,
  navigation
});
