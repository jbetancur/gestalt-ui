import { put, call } from 'redux-saga/effects';
import axios from 'axios';
import { buildAllURL, buildOneURL } from './urlmapper';
import { PREFIX } from '../actionTypes';

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
