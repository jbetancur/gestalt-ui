import { UDPATE_ENTITLEMENT_TOGGLE_STATE } from 'modules/MetaResource/actionTypes';
import {
  FILTER_IDENTITIES_TEXT,
  FILTER_IDENTITIES_TEXT_CLEAR,
} from './actionTypes';

/**
 * Set the Entitlement Toggle states. NOTE: mutation like this is bad. this will be refactored at a later
 * time when the entitlements API can be enhanced
 * @param {*} entitlements
 * @param {*} action
 * @param {*} toggled
 */
export function setEntitlementToggleStates(entitlements, action, toggled, isToggleAllMode) {
  entitlements.forEach((entitlement) => {
    const index = entitlement.actions.findIndex(a => a.key === action.key);

    if (index > -1) {
      // eslint-disable-next-line no-param-reassign
      entitlement.actions[index].toggled = toggled;
    }

    // if isToggleAllMode is false don't handle this branch of code
    if (!isToggleAllMode) {
      if (entitlement.actions.every(a => a.toggled)) {
        // eslint-disable-next-line no-param-reassign
        entitlement.toggled = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        entitlement.toggled = false;
      }
    }
  });

  return { type: UDPATE_ENTITLEMENT_TOGGLE_STATE, payload: entitlements };
}

export function filterIdentities(predicate) {
  return { type: FILTER_IDENTITIES_TEXT, filterText: predicate };
}

export function clearIdentitiesFilter() {
  return { type: FILTER_IDENTITIES_TEXT_CLEAR };
}

export function hideEntitlementsModal() {
  return { type: 'HIDE_MODAL' };
}

export default {
  setEntitlementToggleStates,
  filterIdentities,
  clearIdentitiesFilter,
  hideEntitlementsModal,
};
