import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { orderBy } from 'lodash';
import * as types from '../actionTypes';

/**
 * fetchAPIEndpoints
 * @param {*} action { fqon, entityKey, apiId }
 */
export function* fetchAPIEndpoints(action) {
  try {
    const url = action.entityId ? `${action.fqon}/${action.entityKey}/${action.entityId}/apiendpoints` : `${action.fqon}/apiendpoints`;
    const responseEndpoints = yield call(axios.get, `${url}?expand=true`);

    const endpoints = [];
    // this is a niche case with generators and arrays where we need an imperative loop to collate public_url into endpoints
    // eslint-disable-next-line
    for (const endpoint of responseEndpoints.data) {
      const kongProviderResponse = yield call(axios.get, `${action.fqon}/providers/${endpoint.properties.location_id}`);
      endpoints.push(
        {
          ...endpoint,
          properties: {
            ...endpoint.properties,
            public_url: `${kongProviderResponse.data.properties.config.external_protocol}://${kongProviderResponse.data.properties.config.env.public.PUBLIC_URL_VHOST_0}/${endpoint.properties.parent.name}${endpoint.properties.resource}`
          }
        }
      );
    }

    const payload = orderBy(endpoints, 'created.timestamp', 'asc');
    yield put({ type: types.FETCH_APIENDPOINTS_FULFILLED, payload });
  } catch (e) {
    yield put({ type: types.FETCH_APIENDPOINTS_REJECTED, payload: e.message });
  }
}

/**
 * fetchAPIEndpoint
 * @param {*} action { fqon, apiId, apiendpointId, onSuccess }
 */
export function* fetchAPIEndpoint(action) {
  try {
    const response = yield call(axios.get, `${action.fqon}/apis/${action.apiId}/apiendpoints/${action.apiendpointId}`);

    yield put({ type: types.FETCH_APIENDPOINT_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.FETCH_APIENDPOINT_REJECTED, payload: e.message });
  }
}

/**
 * createAPIEndpoint
 * @param {*} action - { fqon, apiId, payload, onSuccess {returns response.data} }
 */
export function* createAPIEndpoint(action) {
  try {
    const response = yield call(axios.post, `${action.fqon}/apis/${action.apiId}/apiendpoints`, action.payload);
    yield put({ type: types.CREATE_APIENDPOINT_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.CREATE_APIENDPOINT_REJECTED, payload: e.message });
  }
}

/**
 * updateAPIEndpoint
 * @param {*} action - { fqon, apiId, apiendpointId, payload, onSuccess {returns response.data}  }
 */
export function* updateAPIEndpoint(action) {
  try {
    const response = yield call(axios.patch, `${action.fqon}/apis/${action.apiId}/apiendpoints/${action.apiendpointId}`, action.payload);
    yield put({ type: types.UPDATE_APIENDPOINT_FULFILLED, payload: response.data });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(response.data);
    }
  } catch (e) {
    yield put({ type: types.UPDATE_APIENDPOINT_REJECTED, payload: e.message });
  }
}

/**
 * deleteAPIEndpoint
 * @param {*} action - { fqon, apiendpointId, onSuccess }
 */
export function* deleteAPIEndpoint(action) {
  try {
    yield call(axios.delete, `${action.fqon}/apiendpoints/${action.apiendpointId}?force=true`);
    yield put({ type: types.DELETE_APIENDPOINTS_FULFILLED, payload: action.apiendpointId });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_APIENDPOINTS_REJECTED, payload: e.message });
  }
}


/**
 * deleteAPIEndpoints
 * @param {*} action - { fqon, apiendpointIds, onSuccess }
 */
export function* deleteAPIEndpoints(action) {
  try {
    const all = action.apiendpointIds.map(id => axios.delete(`${action.fqon}/apiendpoints/${id}?force=true`));

    yield call(axios.all, all);
    yield put({ type: types.DELETE_APIENDPOINT_FULFILLED });

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: types.DELETE_APIENDPOINT_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_APIENDPOINTS_REQUEST, fetchAPIEndpoints);
  yield fork(takeLatest, types.FETCH_APIENDPOINT_REQUEST, fetchAPIEndpoint);
  yield fork(takeLatest, types.CREATE_APIENDPOINT_REQUEST, createAPIEndpoint);
  yield fork(takeLatest, types.UPDATE_APIENDPOINT_REQUEST, updateAPIEndpoint);
  yield fork(takeLatest, types.DELETE_APIENDPOINT_REQUEST, deleteAPIEndpoint);
  yield fork(takeLatest, types.DELETE_APIENDPOINTS_REQUEST, deleteAPIEndpoints);
}
