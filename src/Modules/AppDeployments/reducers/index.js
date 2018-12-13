import { combineReducers } from 'redux';
import appDeployment from './appDeployment';
import appDeployments from './appDeployments';

export default combineReducers({
  appDeployment,
  appDeployments,
});
