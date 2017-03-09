import axios from 'axios';
import {
  sortBy,
  groupBy,
  map,
  uniq,
} from 'lodash';

import {
  FETCH_ENTITLEMENTS_PENDING,
  FETCH_ENTITLEMENTS_FULFILLED,
  FETCH_ENTITLEMENTS_REJECTED,
  SELECTED_IDENTITY,
  UDPATE_ENTITLEMENT_TOGGLE_STATE,
  FETCH_IDENTITIES_PENDING,
  FETCH_IDENTITIES_FULFILLED,
  FETCH_IDENTITIES_REJECTED,
  UPDATE_ENTITLEMENTS_PENDING,
  UPDATE_ENTITLEMENTS_FULFILLED,
  UPDATE_ENTITLEMENTS_REJECTED,
  ENTITLEMENTS_UNLOADED,
} from './actionTypes';

/**
 * Handle Clearing the state. This should be called when a component unmounts
 */
export function onUnload() {
  return { type: ENTITLEMENTS_UNLOADED };
}

/**
 * Set the current selected Identity to state
 * @param {*} identity
 */
export function setSelectedIdentity(identity) {
  return { type: SELECTED_IDENTITY, payload: identity };
}

/**
 * Fetch Entitlements and transform them into something more usable. NOTE: this will be refactored in a future release when the API
 * is capable of handling entitlements better
 * @param {*} fqon
 * @param {*} entityId
 * @param {*} entityKey
 */
export function fetchEntitlements(fqon, entityId, entityKey, selectedIdentity) {
  return (dispatch) => {
    const url = entityId ? `/${fqon}/${entityKey}/${entityId}/entitlements` : `/${fqon}/entitlements`;

    dispatch({ type: FETCH_ENTITLEMENTS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      // Transform our entitlements into something more helpful
      const extractActions = response.data.map(e => (
        {
          action: e.properties.action,
          entitlement: e,
          identities: e.properties.identities,
        })
      );
      const groupedActions = groupBy(extractActions, a => a.action.split('.')[0]);

      Object.keys(groupedActions).forEach((key) => {
        const prettyActions = groupedActions[key].map(a => (
          {
            key: a.action,
            action: a.action.split('.')[1],
            entitlement: a.entitlement,
            identities: a.identities,
            toggled: a.identities.some(item => item.id === selectedIdentity.id),
          })
        );
        groupedActions[key] = sortBy(prettyActions, 'action');
      });

      // map entitlements back into an array
      const entitlements = map(groupedActions, (actions, type) => ({ type, actions, toggled: actions.every(a => a.toggled) }));

      dispatch({
        type: FETCH_ENTITLEMENTS_FULFILLED,
        payload: sortBy(entitlements, 'type'),
      });

      dispatch(setSelectedIdentity(selectedIdentity));
    }).catch((err) => {
      dispatch({ type: FETCH_ENTITLEMENTS_REJECTED, payload: err });
    });
  };
}

/**
 * Fetch all users and groups and concat into a single identies array
 * @param {*} fqon
 */
export function fetchIdentities(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_IDENTITIES_PENDING });

    function getUsers() {
      return axios.get(`${fqon}/users`);
    }

    function getGroups() {
      return axios.get(`${fqon}/groups`);
    }

    axios.all([getUsers(), getGroups()]).then(axios.spread((users, groups) => {
      const payload = sortBy(users.data.concat(groups.data), 'name');
      dispatch({ type: FETCH_IDENTITIES_FULFILLED, payload });
    })).catch((err) => {
      dispatch({ type: FETCH_IDENTITIES_REJECTED, payload: err });
    });
  };
}

/**
 * Update Entitlements
 * @param {*} fqon
 * @param {*} newIdentity
 * @param {*} actions
 * @param {*} entityId
 * @param {*} entityKey
 */
export function updateEntitlements(fqon, newIdentity, actions, entityId, entityKey) {
  return (dispatch) => {
    const all = actions.map((action) => {
      const originalIdentifies = [...action.identities.map(ident => ident.id)];
      let clonedIdenities = [...action.identities.map(ident => ident.id)];
      const hasIdentity = action.identities.some(ident => ident.id === newIdentity.id);
      if (action.toggled) {
        if (hasIdentity) {
          clonedIdenities = uniq(clonedIdenities);
        } else {
          clonedIdenities.push(newIdentity.id);
        }
      } else if (clonedIdenities.indexOf(newIdentity.id) > -1) {
        clonedIdenities.splice(clonedIdenities.indexOf(newIdentity.id), 1);
      }

      // check if identities have changed to prevent unnecessary PUTS
      if (clonedIdenities.length !== originalIdentifies.length) {
        return axios.put(`${fqon}/entitlements/${action.entitlement.id}`, {
          id: action.entitlement.id,
          name: action.entitlement.name,
          properties: {
            action: action.key,
            identities: clonedIdenities,
          },
        });
      }

      return undefined; // we deal with this below with filter so we dont try to call an undefined promise
    });

    const promises = all.filter(req => req !== undefined);

    if (promises.length) {
      dispatch({ type: UPDATE_ENTITLEMENTS_PENDING });

      axios.all(promises).then(() => {
        dispatch({ type: UPDATE_ENTITLEMENTS_FULFILLED });
        dispatch(fetchEntitlements(fqon, entityId, entityKey, newIdentity));
      }).catch((err) => {
        dispatch({ type: UPDATE_ENTITLEMENTS_REJECTED, payload: err });
      });
    }
  };
}

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
