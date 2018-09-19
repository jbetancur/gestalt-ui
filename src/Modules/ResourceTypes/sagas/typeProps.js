import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import {
  CREATE_TYPEPROPERTY_REQUEST,
  CREATE_TYPEPROPERTY_FULFILLED,
  CREATE_TYPEPROPERTY_REJECTED,
  UPDATE_TYPEPROPERTY_REQUEST,
  UPDATE_TYPEPROPERTY_FULFILLED,
  UPDATE_TYPEPROPERTY_REJECTED,
  DELETE_TYPEPROPERTY_REQUEST,
  DELETE_TYPEPROPERTY_FULFILLED,
  DELETE_TYPEPROPERTY_REJECTED,
  BATCH_UPDATE_TYPEPROPERTY_REQUEST,
  BATCH_UPDATE_TYPEPROPERTY_FULFILLED,
  BATCH_UPDATE_TYPEPROPERTY_REJECTED,
} from '../constants';

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

    yield put({ type: CREATE_TYPEPROPERTY_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: CREATE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}

/**
 * updateTypeProperty
 * @param {*} action - { fqon, typePropertyId, payload, onSuccess {returns response.data}  }
 */
export function* updateTypeProperty(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/typeproperties/${action.typePropertyId}`, action.payload);
    yield put({ type: UPDATE_TYPEPROPERTY_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: UPDATE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}

/**
 * deleteTypeProperty
 * @param {*} action - { fqon, typePropertyId, onSuccess }
 */
export function* deleteTypeProperty(action) {
  try {
    yield call(axios.delete, `${action.fqon}/typeproperties/${action.typePropertyId}`);
    yield put({ type: DELETE_TYPEPROPERTY_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_TYPEPROPERTY_REJECTED, payload: e.message });
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

    yield put({ type: BATCH_UPDATE_TYPEPROPERTY_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: BATCH_UPDATE_TYPEPROPERTY_REJECTED, payload: e.message });
  }
}


// Watchers
export default function* () {
  yield fork(takeLatest, CREATE_TYPEPROPERTY_REQUEST, createTypeProperty);
  yield fork(takeLatest, UPDATE_TYPEPROPERTY_REQUEST, updateTypeProperty);
  yield fork(takeLatest, DELETE_TYPEPROPERTY_REQUEST, deleteTypeProperty);
  yield fork(takeLatest, BATCH_UPDATE_TYPEPROPERTY_REQUEST, batchUpdateTypeProperties);
}
