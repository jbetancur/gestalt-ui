import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  sortBy,
  groupBy,
  map,
  uniq,
} from 'lodash';
import {
  FETCH_ENTITLEMENTS_REQUEST,
  FETCH_ENTITLEMENTS_FULFILLED,
  FETCH_ENTITLEMENTS_REJECTED,
  UPDATE_ENTITLEMENT_FULFILLED,
  UPDATE_ENTITLEMENT_REJECTED,
  UPDATE_ENTITLEMENT_REQUEST,
} from '../constants';

/**
 * fetchEntitlements
 * @param {*} action { fqon, entityId, entityKey, identityId }
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
          toggled: a.identities.some(item => item.id === action.identityId),
        })
      );
      groupedActions[key] = sortBy(prettyActions, 'action');
    });

    // map entitlements back into an array
    const entitlements = map(groupedActions, (actions, type) => ({ type, actions, toggled: actions.every(a => a.toggled) }));

    yield put({ type: FETCH_ENTITLEMENTS_FULFILLED, payload: sortBy(entitlements, 'type') });
  } catch (e) {
    yield put({ type: FETCH_ENTITLEMENTS_REJECTED, payload: e.message });
  }
}

/**
 * updateEntitlements
 * @param {*} action { fqon, identityId, actions, entityId, entityKey }
 */
export function* updateEntitlements(action) {
  const actionParam = action.actions || [];

  try {
    const all = actionParam.map((actionItem) => {
      const originalIdentifies = [...actionItem.identities.map(ident => ident.id)];
      let clonedIdenities = [...actionItem.identities.map(ident => ident.id)];
      const hasIdentity = actionItem.identities.some(ident => ident.id === action.identityId);

      if (actionItem.toggled) {
        if (hasIdentity) {
          clonedIdenities = uniq(clonedIdenities);
        } else {
          clonedIdenities.push(action.identityId);
        }
      } else if (clonedIdenities.indexOf(action.identityId) > -1) {
        clonedIdenities.splice(clonedIdenities.indexOf(action.identityId), 1);
      }

      // check if identities have changed to prevent unnecessary PUTS
      if (clonedIdenities.length !== originalIdentifies.length) {
        return axios.put(`${action.fqon}/entitlements/${actionItem.entitlement.id}`, {
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

    yield put({ type: UPDATE_ENTITLEMENT_FULFILLED });
  } catch (e) {
    yield put({ type: UPDATE_ENTITLEMENT_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield takeLatest(FETCH_ENTITLEMENTS_REQUEST, fetchEntitlements);
  yield takeLatest(UPDATE_ENTITLEMENT_REQUEST, updateEntitlements);
}
