import { combineReducers } from 'redux';

import selfReducer from './self';

export default combineReducers({
  self: selfReducer
});
