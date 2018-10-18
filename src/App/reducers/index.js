import { combineReducers } from 'redux';

import activityIndicator from './activityIndicator';
import showExperimental from './showExperimental';
import navigation from './navigation';

export default combineReducers({
  activityIndicator,
  showExperimental,
  navigation,
});
