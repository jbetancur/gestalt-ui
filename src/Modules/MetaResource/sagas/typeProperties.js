import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';

/**
 * createTypeProperty
 * @param {*} action - { fqon, resourceTypeId, payload, onSuccess {returns response.data} }
 */
export function* createTypeProperty(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/resourcetypes/${action.resourceTypeId}/typeproperties`, action.payload);

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }

    yield put({ type: types.CREATE_TYPEPROPERTY_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: types.CREATE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}

/**
 * updateTypeProperty
 * @param {*} action - { fqon, typePropertyId, payload, onSuccess {returns response.data}  }
 */
export function* updateTypeProperty(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/typeproperties/${action.typePropertyId}`, action.payload);
    yield put({ type: types.UPDATE_TYPEPROPERTY_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}

/**
 * deleteTypeProperty
 * @param {*} action - { fqon, typePropertyId, onSuccess }
 */
export function* deleteTypeProperty(action) {
  try {
    yield call(axios.delete, `${action.fqon}/typeproperties/${action.typePropertyId}`);
    yield put({ type: types.DELETE_TYPEPROPERTY_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}

/**
 * batchUpdate
 * @param {*} action - { fqon, operations, onSuccess }
 */
export function* batchUpdateTypeProperties(action) {
  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < action.operations.length; i++) {
      const item = action.operations[i];

      if (item.op === 'PATCH' && item.patches.length > 0) {
        yield call(updateTypeProperty, { fqon: action.fqon, typePropertyId: item.id, payload: item.patches });
      }

      if (item.op === 'POST') {
        yield call(createTypeProperty, { fqon: action.fqon, resourceTypeId: item.resourceTypeId, payload: item.payload });
      }

      if (item.op === 'DELETE') {
        yield call(deleteTypeProperty, { fqon: action.fqon, typePropertyId: item.id });
      }
    }

    yield put({ type: types.BATCH_UPDATE_TYPEPROPERTY_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.BATCH_UPDATE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}


// Watchers
export default function* () {
  yield fork(takeLatest, types.CREATE_TYPEPROPERTY_REQUEST, createTypeProperty);
  yield fork(takeLatest, types.UPDATE_TYPEPROPERTY_REQUEST, updateTypeProperty);
  yield fork(takeLatest, types.DELETE_TYPEPROPERTY_REQUEST, deleteTypeProperty);
  yield fork(takeLatest, types.BATCH_UPDATE_TYPEPROPERTY_REQUEST, batchUpdateTypeProperties);
}
