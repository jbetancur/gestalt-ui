import { put, call } from 'redux-saga/effects';
import axios from 'axios';
import { buildAllURL, buildOneURL } from './urlmapper';
import { PREFIX } from '../actionTypes';

// Exported for testability
export const fetchAll = (name, entity) => function* getAll(payload) {
  try {
    const response = yield call(axios.get, buildAllURL(entity, payload, true));

    yield put({ type: `${PREFIX}FETCH_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}FETCH_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const fetchOne = (name, entity) => function* getOne(payload) {
  try {
    const response = yield call(axios.get, buildOneURL(entity, payload));

    yield put({ type: `${PREFIX}FETCH_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}FETCH_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const create = (name, entity) => function* createOne(payload) {
  try {
    let response;

    if (payload.payload) {
      response = yield call(axios.post, buildAllURL(entity, payload), payload.payload);
    } else {
      response = yield call(axios.post, buildAllURL(entity, payload));
    }

    yield put({ type: `${PREFIX}CREATE_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}CREATE_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const update = (name, entity) => function* updateOne(payload) {
  try {
    const response = yield call(axios.patch, buildOneURL(entity, payload), payload.payload);

    yield put({ type: `${PREFIX}UPDATE_${name}_FULFILLED`, payload: response.data });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess(response.data);
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}UPDATE_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const deleteOne = (name, entity) => function* deleteSingle(payload) {
  try {
    yield call(axios.delete, buildOneURL(entity, payload));
    yield put({ type: `${PREFIX}DELETE_${name}_FULFILLED` });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}DELETE_${name}_REJECTED`, payload: error });
  }
};

// Exported for testability
export const deleteMany = (name, entity) => function* deleteBulk(payload) {
  try {
    const all = payload.ids.map(id => axios.delete(buildOneURL(entity, Object.assign(payload, { id }))));

    yield call(axios.all, all);
    yield put({ type: `${PREFIX}DELETE_${name}_FULFILLED` });

    if (typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    if (typeof payload.onError === 'function') {
      payload.onError(error);
    }

    yield put({ type: `${PREFIX}DELETE_${name}_REJECTED`, payload: error });
  }
};

export const generateFetchAll = (name, entity) => [`${PREFIX}FETCH_${name}_REQUEST`, fetchAll(name, entity)];
export const generateFetchOne = (name, entity) => [`${PREFIX}FETCH_${name}_REQUEST`, fetchOne(name, entity)];
export const generateCreate = (name, entity) => [`${PREFIX}CREATE_${name}_REQUEST`, create(name, entity)];
export const generateUpdate = (name, entity) => [`${PREFIX}UPDATE_${name}_REQUEST`, update(name, entity)];
export const generateDelete = (name, entity) => [`${PREFIX}DELETE_${name}_REQUEST`, deleteOne(name, entity)];
export const generateDeleteMany = (name, entity) => [`${PREFIX}DELETE_${name}_REQUEST`, deleteMany(name, entity)];
