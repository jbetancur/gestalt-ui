import { combineReducers } from 'redux';

import fetchAll from './workspaces';
import fetchOne from './workspace';

export default combineReducers({
  fetchAll,
  fetchOne
});
