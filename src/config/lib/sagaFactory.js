import { put, call, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { getLastFromSplit } from 'util/helpers/strings';
import { notificationActions } from 'Modules/Notifications';
import { PREFIX } from '../../constants';
import { buildAllURL, buildOneURL } from './urlmapper';
import { fetchAPI } from './utility';

// Exported for testability
export const fetchAll = ({ name, entity, verb = 'FETCH', prefix = PREFIX }) => function* getAll(payload) {
  try {
    const response = yield call(fetchAPI, buildAllURL(entity, payload, true));

    yield put({ type: `${prefix}${verb}_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${prefix}${verb}_${name}_REJECTED`, payload: error });
  } finally {
    if (yield cancelled()) {
      yield put({ type: `${prefix}${verb}_${name}_CANCELLED` });
    }
  }
};

// Exported for testability
export const fetchOne = ({ name, entity, verb = 'FETCH', prefix = PREFIX }) => function* getOne(payload) {
  try {
    const response = yield call(fetchAPI, buildOneURL(entity, payload));

    yield put({ type: `${prefix}${verb}_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${prefix}${verb}_${name}_REJECTED`, payload: error });
  } finally {
    if (yield cancelled()) {
      yield put({ type: `${prefix}${verb}_${name}_CANCELLED` });
    }
  }
};

// Exported for testability
export const create = ({ name, entity, verb = 'CREATE', prefix = PREFIX }) => function* createOne(payload) {
  try {
    let response;

    if (payload.payload) {
      response = yield call(axios.post, buildAllURL(entity, payload), payload.payload);
    } else {
      response = yield call(axios.post, buildAllURL(entity, payload));
    }

    yield put({ type: `${prefix}${verb}_${name}_FULFILLED`, payload: response.data });
    yield put(notificationActions.addNotification({ message: `${response.data.name} ${getLastFromSplit(response.data.resource_type)} created` }));

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${prefix}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const update = ({ name, entity, verb = 'UPDATE', prefix = PREFIX }) => function* updateOne(payload) {
  try {
    const response = yield call(axios.patch, buildOneURL(entity, payload), payload.payload);

    yield put({ type: `${prefix}${verb}_${name}_FULFILLED`, payload: response.data });
    yield put(notificationActions.addNotification({ message: `${response.data.name} ${getLastFromSplit(response.data.resource_type)} updated` }));

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${prefix}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const deleteOne = ({ name, entity, parentName, verb = 'DELETE', prefix = PREFIX }) => function* deleteSingle(payload) {
  try {
    yield call(axios.delete, buildOneURL(entity, Object.assign(payload, { id: payload.resource.id })));
    yield put({ type: `${prefix}${verb}_${name}_FULFILLED`, payload: payload.resource });

    if (parentName) {
      yield put({ type: `${prefix}${verb}_${parentName}_FULFILLED`, payload: payload.resource });
    }

    yield put(notificationActions.addNotification({ message: `${payload.resource.name} ${getLastFromSplit(payload.resource.resource_type)} deleted` }));

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${prefix}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const deleteMany = ({ name, entity, verb = 'DELETE', prefix = PREFIX }) => function* deleteBulk(payload) {
  try {
    const resources = payload.resources.map(resource => axios.delete(buildOneURL(entity, Object.assign(payload, { id: resource.id }))));
    const names = payload.resources.map(item => (item.name)).join('\n');

    yield call(axios.all, resources);
    yield put({ type: `${prefix}${verb}_${name}_FULFILLED`, payload: payload.resources });
    yield put(notificationActions.addNotification({ message: `${names} ${entity} deleted` }));

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${prefix}${verb}_${name}_REJECTED`, payload: error });
  }
};

export const generateFetchAll = ({ name, entity = '', verb = 'FETCH', prefix = PREFIX }) =>
  [`${prefix}${verb}_${name}_REQUEST`, fetchAll({ name, entity, verb, prefix })];
export const generateFetchOne = ({ name, entity = '', verb = 'FETCH', prefix = PREFIX }) =>
  [`${prefix}${verb}_${name}_REQUEST`, fetchOne({ name, entity, verb, prefix })];
export const generateCreate = ({ name, entity = '', verb = 'CREATE', prefix = PREFIX }) =>
  [`${prefix}${verb}_${name}_REQUEST`, create({ name, entity, verb, prefix })];
export const generateUpdate = ({ name, entity = '', verb = 'UPDATE', prefix = PREFIX }) =>
  [`${prefix}${verb}_${name}_REQUEST`, update({ name, entity, verb, prefix })];
export const generateDelete = ({ name, entity = '', parentName, verb = 'DELETE', prefix = PREFIX }) =>
  [`${prefix}${verb}_${name}_REQUEST`, deleteOne({ name, entity, parentName, verb, prefix })];
export const generateDeleteMany = ({ name, entity = '', verb = 'DELETE', prefix = PREFIX }) =>
  [`${prefix}${verb}_${name}_REQUEST`, deleteMany({ name, entity, verb, prefix })];
