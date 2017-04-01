import { combineReducers } from 'redux';
import selectedPolicyRules from './selectedPolicyRules';
import selectedActions from './selectedActions';

export default combineReducers({
  selectedPolicyRules,
  selectedActions,
});
