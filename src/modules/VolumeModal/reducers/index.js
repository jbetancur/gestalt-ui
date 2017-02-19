import { combineReducers } from 'redux';
import volumes from './volumes';
import volumeModal from './volumeModal';

export default combineReducers({
  volumes,
  volumeModal,
});
