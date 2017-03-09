import { combineReducers } from 'redux';
import fetchAll from './entitlements';
import selectedIdentity from './selectedIdentity';
import identities from './identities';
import entitlementUpdate from './entitlementUpdate';

export default combineReducers({
  fetchAll,
  identities,
  selectedIdentity,
  entitlementUpdate,
});
