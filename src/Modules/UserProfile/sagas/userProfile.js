import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { fetchAPI } from 'config/lib/utility';
import {
  CREATE_USERPROFILE_REQUEST,
  CREATE_USERPROFILE_FULFILLED,
  CREATE_USERPROFILE_REJECTED,
  FETCH_USERPROFILE_REQUEST,
  FETCH_USERPROFILE_FULFILLED,
  FETCH_USERPROFILE_REJECTED,
  // UPDATE_FAVORITE_REQUEST,
  // UPDATE_FAVORITE_FULFILLED,
  // UPDATE_FAVORITE_REJECTED,
  CREATE_FAVORITE_REQUEST,
  CREATE_FAVORITE_FULFILLED,
  CREATE_FAVORITE_REJECTED,
  DELETE_FAVORITE_REQUEST,
  DELETE_FAVORITE_FULFILLED,
  DELETE_FAVORITE_REJECTED,
} from '../actionTypes';
import profileModel from '../models/userProfile';
import favoriteModel from '../models/favorite';

/**
 * createProfile
 */
export function* createProfile(payload) {
  try {
    const { data } = yield call(axios.post, 'users/self/userprofiles', profileModel.create(payload));

    yield put({ type: CREATE_USERPROFILE_FULFILLED, payload: profileModel.get(data) });
  } catch (e) {
    yield put({ type: CREATE_USERPROFILE_REJECTED, payload: e.message });
  }
}

/**
 * fetchProfile
 */
export function* fetchDefaultProfile() {
  try {
    const { data } = yield call(fetchAPI, 'users/self/userprofiles/default');

    if (!data) {
      const profileResponse = yield call(createProfile, { name: 'default-self-profile' });
      yield put({ type: FETCH_USERPROFILE_FULFILLED, payload: profileModel.get(profileResponse.data) });
    } else {
      yield put({ type: FETCH_USERPROFILE_FULFILLED, payload: profileModel.get(data) });
    }
  } catch (e) {
    yield put({ type: FETCH_USERPROFILE_REJECTED, payload: e.message });
  }
}

/**
 * createFavorite
 * @param {Object} action: { payload }
 */
export function* createFavorite(action) {
  try {
    const { data } = yield call(axios.post, 'users/self/userprofiles/default/favorites', favoriteModel.create(action.payload));

    yield put({ type: CREATE_FAVORITE_FULFILLED, payload: favoriteModel.get(data) });
  } catch (e) {
    yield put({ type: CREATE_FAVORITE_REJECTED, payload: e.message });
  }
}

/**
 * deleteFavorite
 * @param {Object} action: { id }
 */
export function* deleteFavorite(action) {
  try {
    yield call(axios.delete, `users/self/userprofiles/default/favorites?id=${action.id}`);

    yield put({ type: DELETE_FAVORITE_FULFILLED, payload: action });
  } catch (e) {
    yield put({ type: DELETE_FAVORITE_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield takeLatest(CREATE_USERPROFILE_REQUEST, createProfile);
  yield takeLatest(FETCH_USERPROFILE_REQUEST, fetchDefaultProfile);
  // yield takeLatest(UPDATE_FAVORITE_REQUEST, fetchProfile);
  yield takeLatest(CREATE_FAVORITE_REQUEST, createFavorite);
  yield takeLatest(DELETE_FAVORITE_REQUEST, deleteFavorite);
}
