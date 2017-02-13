import { combineReducers } from 'redux';
import fetchAll from './policyRules';
import fetchOne from './policyRule';
import policyRuleUpdate from './policyRuleUpdate';
import selectedPolicyRules from './selectedPolicyRules';
import selectedActions from './selectedActions';

export default combineReducers({
  fetchAll,
  fetchOne,
  policyRuleUpdate,
  selectedPolicyRules,
  selectedActions,
});
