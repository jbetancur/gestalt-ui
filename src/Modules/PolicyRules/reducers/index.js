import { combineReducers } from 'redux';
import policyRules from './policyRules';
import policyRule from './policyRule';

export default combineReducers({
  policyRules,
  policyRule,
});
