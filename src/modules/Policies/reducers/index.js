import { combineReducers } from 'redux';
import fetchAll from './policies';
import fetchOne from './policy';
import policyUpdate from './policyUpdate';
import selectedPolicies from './selectedPolicies';

export default combineReducers({
  fetchAll,
  fetchOne,
  policyUpdate,
  selectedPolicies,
});
