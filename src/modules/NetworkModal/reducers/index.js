import { combineReducers } from 'redux';
import networks from './networks';
import networkModal from './networkModal';

export default combineReducers({
  networks,
  networkModal,
});
