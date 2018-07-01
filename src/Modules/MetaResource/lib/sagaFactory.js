import { put, call } from 'redux-saga/effects';
import axios from 'axios';
import { buildAllURL, buildOneURL } from './urlmapper';
import { PREFIX } from '../actionTypes';

// Exported for testability
export const fetchAll = (name, entity, verb = 'FETCH') => function* getAll(payload) {
  try {
    const response = yield call(axios.get, buildAllURL(entity, payload, true));

    yield put({ type: `${PREFIX}${verb}_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const fetchOne = (name, entity, verb = 'FETCH') => function* getOne(payload) {
  try {
    const response = yield call(axios.get, buildOneURL(entity, payload));

    yield put({ type: `${PREFIX}${verb}_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const create = (name, entity, verb = 'CREATE') => function* createOne(payload) {
  try {
    let response;

    if (payload.payload) {
      response = yield call(axios.post, buildAllURL(entity, payload), payload.payload);
    } else {
      response = yield call(axios.post, buildAllURL(entity, payload));
    }

    yield put({ type: `${PREFIX}${verb}_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const update = (name, entity, verb = 'UPDATE') => function* updateOne(payload) {
  try {
    const response = yield call(axios.patch, buildOneURL(entity, payload), payload.payload);

    yield put({ type: `${PREFIX}${verb}_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const deleteOne = (name, entity, parentName, verb = 'DELETE') => function* deleteSingle(payload) {
  try {
    yield call(axios.delete, buildOneURL(entity, payload));
    yield put({ type: `${PREFIX}${verb}_${name}_FULFILLED`, payload: payload.id });

    if (parentName) {
      yield put({ type: `${PREFIX}${verb}_${parentName}_FULFILLED`, payload: payload.id });
    }

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}${verb}_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const deleteMany = (name, entity, verb = 'DELETE') => function* deleteBulk(payload) {
  try {
    const all = payload.ids.map(id => axios.delete(buildOneURL(entity, Object.assign(payload, { id }))));

    yield call(axios.all, all);
    yield put({ type: `${PREFIX}${verb}_${name}_FULFILLED` });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}${verb}_${name}_REJECTED`, payload: error });
  }
};

export const generateFetchAll = (name, entity = '', verb = 'FETCH') =>
  [`${PREFIX}${verb}_${name}_REQUEST`, fetchAll(name, entity, verb)];
export const generateFetchOne = (name, entity = '', verb = 'FETCH') =>
  [`${PREFIX}${verb}_${name}_REQUEST`, fetchOne(name, entity, verb)];
export const generateCreate = (name, entity = '', verb = 'CREATE') =>
  [`${PREFIX}${verb}_${name}_REQUEST`, create(name, entity, verb)];
export const generateUpdate = (name, entity = '', verb = 'UPDATE') =>
  [`${PREFIX}${verb}_${name}_REQUEST`, update(name, entity, verb)];
export const generateDelete = (name, entity = '', parentName, verb = 'DELETE') =>
  [`${PREFIX}${verb}_${name}_REQUEST`, deleteOne(name, entity, parentName, verb)];
export const generateDeleteMany = (name, entity = '', verb = 'DELETE') =>
  [`${PREFIX}${verb}_${name}_REQUEST`, deleteMany(name, entity, verb)];
