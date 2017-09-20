import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import {
  sortBy,
  groupBy,
  map,
  uniq,
} from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchEntitlements
 * @param {*} action { fqon, entityId, entityKey, selectedIdentityId }
 */
export function* fetchEntitlements(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/entitlements` : `${action.fqon}/entitlements`;
  try {
    const response = yield call(axios.get, `${url}?expand=true`);

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
          toggled: a.identities.some(item => item.id === action.selectedIdentityId),
        })
      );
      groupedActions[key] = sortBy(prettyActions, 'action');
    });

    // map entitlements back into an array
    const entitlements = map(groupedActions, (actions, type) => ({ type, actions, toggled: actions.every(a => a.toggled) }));

    yield put({ type: types.FETCH_ENTITLEMENTS_FULFILLED, payload: sortBy(entitlements, 'type') });
  } catch (e) {
    yield put({ type: types.FETCH_ENTITLEMENTS_REJECTED, payload: e.message });
  }
}

/**
 * fetchIdentities
 * @param {*} action { fqon }
 */
export function* fetchIdentities(action) {
  function getUsers() {
    return axios.get(`${action.fqon}/users`);
  }

  function getGroups() {
    return axios.get(`${action.fqon}/groups`);
  }

  try {
    const response = yield call(axios.all, [getUsers(), getGroups()]);
    const payload = sortBy(response[0].data.concat(response[1].data || []), 'name');

    yield put({ type: types.FETCH_IDENTITIES_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_IDENTITIES_REJECTED, payload: e.message });
  }
}

/**
 * updateEntitlements
 * @param {*} action { fqon, newIdentity, actions, entityId, entityKey }
 */
export function* updateEntitlements(action) {
  const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/entitlements` : `${action.fqon}/entitlements`;
  const actionParam = action.actions || [];

  try {
    const all = actionParam.map((actionItem) => {
      const originalIdentifies = [...actionItem.identities.map(ident => ident.id)];
      let clonedIdenities = [...actionItem.identities.map(ident => ident.id)];
      const hasIdentity = actionItem.identities.some(ident => ident.id === action.newIdentityId);

      if (actionItem.toggled) {
        if (hasIdentity) {
          clonedIdenities = uniq(clonedIdenities);
        } else {
          clonedIdenities.push(action.newIdentityId);
        }
      } else if (clonedIdenities.indexOf(action.newIdentityId) > -1) {
        clonedIdenities.splice(clonedIdenities.indexOf(action.newIdentityId), 1);
      }

      // check if identities have changed to prevent unnecessary PUTS
      if (clonedIdenities.length !== originalIdentifies.length) {
        return axios.put(`${url}/${actionItem.entitlement.id}`, {
          id: actionItem.entitlement.id,
          name: actionItem.entitlement.name,
          properties: {
            action: actionItem.key,
            identities: clonedIdenities,
          },
        });
      }

      return undefined; // we deal with this below with filter so we dont try to call an undefined promise
    });

    const promises = all.filter(req => req !== undefined);

    if (promises.length) {
      yield call(axios.all, promises);


      if (typeof action.onSuccess === 'function') {
        action.onSuccess();
      }
    }

    yield put({ type: types.UPDATE_ENTITLEMENT_FULFILLED });
  } catch (e) {
    yield put({ type: types.UPDATE_ENTITLEMENT_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_ENTITLEMENTS_REQUEST, fetchEntitlements);
  yield fork(takeLatest, types.FETCH_IDENTITIES_REQUEST, fetchIdentities);
  yield fork(takeLatest, types.UPDATE_ENTITLEMENT_REQUEST, updateEntitlements);
}

