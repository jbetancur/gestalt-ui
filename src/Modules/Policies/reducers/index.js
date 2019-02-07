import { combineReducers } from 'redux';
import policy from './policy';
import policies from './policies';

export default combineReducers({
  policies,
  policy,
});
