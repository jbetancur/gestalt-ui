import { combineReducers } from 'redux';
import healthChecks from './healthChecks';
import healthCheckModal from './healthCheckModal';

export default combineReducers({
  healthChecks,
  healthCheckModal,
});
