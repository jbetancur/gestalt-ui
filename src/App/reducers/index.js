import { combineReducers } from 'redux';

import activityIndicator from './activityIndicator';
import showExperimental from './showExperimental';

export default combineReducers({
  activityIndicator,
  showExperimental,
});
