import { combineReducers } from 'redux';

import login from './login';
import loginModal from './loginModal';

export default combineReducers({
  login,
  loginModal,
});
