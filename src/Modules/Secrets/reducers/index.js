import { combineReducers } from 'redux';
import secretPanelModal from './secretPanelModal';
import secrets from './secrets';

export default combineReducers({
  secrets,
  secretPanelModal,
});
