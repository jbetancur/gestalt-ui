import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAPI } from 'config/lib/utility';
import userProfileSagas, {
  fetchDefaultProfile,
  updateUserProfile,
  createProfile,
  createFavorite,
  deleteFavorite,
} from './userProfile';
import {
  CREATE_USERPROFILE_REQUEST,
  CREATE_USERPROFILE_FULFILLED,
  CREATE_USERPROFILE_REJECTED,
  FETCH_USERPROFILE_REQUEST,
  FETCH_USERPROFILE_FULFILLED,
  FETCH_USERPROFILE_REJECTED,
  UPDATE_USERPROFILE_REQUEST,
  UPDATE_USERPROFILE_FULFILLED,
  UPDATE_USERPROFILE_REJECTED,
  CREATE_FAVORITE_REQUEST,
  CREATE_FAVORITE_FULFILLED,
  CREATE_FAVORITE_REJECTED,
  DELETE_FAVORITE_REQUEST,
  DELETE_FAVORITE_FULFILLED,
  DELETE_FAVORITE_REJECTED,
} from '../actionTypes';
import profileModel from '../models/userProfile';
import favoriteModel from '../models/favorite';

const error = 'an error has occured';

describe('UserProfile::Sagas::createProfile Sequence', () => {
  const saga = createProfile({ name: 'default-self-profile' });
  let result;

  it('should make an api call', () => {
    result = saga.next();
    expect(result.value).toEqual(
      call(axios.post, 'users/self/userprofiles', profileModel.create({ name: 'default-self-profile' }))
    );
  });

  it('should return a userProfileSagas and dispatch a success status', () => {
    result = saga.next({ data: profileModel.schema.cast() });
    expect(result.value).toEqual(
      put({ type: CREATE_USERPROFILE_FULFILLED, payload: profileModel.get() })
    );

    // Finish the iteration
    result = saga.next();
  });

  it('should dispatch a reject status when there is an error', () => {
    const sagaError = createProfile({ name: 'default-self-profile' });
    let resultError = sagaError.next();

    resultError = sagaError.throw({ message: error });

    expect(resultError.value).toEqual(
      put({ type: CREATE_USERPROFILE_REJECTED, payload: error })
    );
  });
});

describe('UserProfile::Sagas::fetchDefaultProfile Sequence', () => {
  const saga = fetchDefaultProfile();
  let result;

  it('should make an api call', () => {
    result = saga.next();
    expect(result.value).toEqual(
      call(fetchAPI, 'users/self/userprofiles/default')
    );
  });

  it('should return a userProfileSagas and dispatch a success status', () => {
    result = saga.next({ data: profileModel.schema.cast() });
    expect(result.value).toEqual(
      put({ type: FETCH_USERPROFILE_FULFILLED, payload: profileModel.get() })
    );

    // Finish the iteration
    result = saga.next();
  });

  it('should dispatch a reject status when there is an error', () => {
    const sagaError = fetchDefaultProfile();
    let resultError = sagaError.next();

    resultError = sagaError.throw({ message: error });

    expect(resultError.value).toEqual(
      put({ type: FETCH_USERPROFILE_REJECTED, payload: error })
    );
  });
});

describe('UserProfile::Sagas::updateUserProfile Sequence', () => {
  const action = { fqon: 'root', id: '123', payload: [] };
  const saga = updateUserProfile(action);
  let result;

  it('should make an api call', () => {
    result = saga.next();
    expect(result.value).toEqual(
      call(axios.patch, 'root/userprofiles/123', action.payload)
    );
  });

  it('should return a userProfileSagas and dispatch a success status', () => {
    result = saga.next({ data: { id: '123' } });
    expect(result.value).toEqual(
      put({ type: UPDATE_USERPROFILE_FULFILLED, payload: { id: '123' } })
    );
  });

  it('should dispatch a reject status when there is an error', () => {
    const sagaError = updateUserProfile(action);
    let resultError = sagaError.next();

    resultError = sagaError.throw({ message: error });

    expect(resultError.value).toEqual(
      put({ type: UPDATE_USERPROFILE_REJECTED, payload: error })
    );
  });
});

describe('UserProfile::Sagas::createFavorite Sequence', () => {
  const action = { payload: favoriteModel.create() };
  const saga = createFavorite(action);
  let result;

  it('should make an api call', () => {
    result = saga.next();
    expect(result.value).toEqual(
      call(axios.post, 'users/self/userprofiles/default/favorites', action.payload)
    );
  });

  it('should return a userProfileSagas and dispatch a success status', () => {
    result = saga.next({ data: favoriteModel.schema.cast() });
    expect(result.value).toEqual(
      put({ type: CREATE_FAVORITE_FULFILLED, payload: favoriteModel.get() })
    );

    // Finish the iteration
    result = saga.next();
  });

  it('should dispatch a reject status when there is an error', () => {
    const sagaError = createFavorite(action);
    let resultError = sagaError.next();

    resultError = sagaError.throw({ message: error });

    expect(resultError.value).toEqual(
      put({ type: CREATE_FAVORITE_REJECTED, payload: error })
    );
  });
});

describe('UserProfile::Sagas::deleteFavorite Sequence', () => {
  const action = { id: '1' };
  const saga = deleteFavorite(action);
  let result;

  it('should make an api call', () => {
    result = saga.next();
    expect(result.value).toEqual(
      call(axios.delete, 'users/self/userprofiles/default/favorites?id=1')
    );
  });

  it('should return a userProfileSagas and dispatch a success status', () => {
    result = saga.next({ data: profileModel.schema.cast() });
    expect(result.value).toEqual(
      put({ type: DELETE_FAVORITE_FULFILLED, payload: action })
    );

    // Finish the iteration
    result = saga.next();
  });

  it('should dispatch a reject status when there is an error', () => {
    const sagaError = deleteFavorite(action);
    let resultError = sagaError.next();

    resultError = sagaError.throw({ message: error });

    expect(resultError.value).toEqual(
      put({ type: DELETE_FAVORITE_REJECTED, payload: error })
    );
  });
});

describe('UserProfile::Sagas::Watchers', () => {
  let result;
  const rootSaga = userProfileSagas();

  it('should fork a watcher for createProfile', () => {
    result = rootSaga.next();
    expect(result.value).toEqual(
      takeLatest(CREATE_USERPROFILE_REQUEST, createProfile)
    );
  });

  it('should fork a watcher for fetchProfile', () => {
    result = rootSaga.next();
    expect(result.value).toEqual(
      takeLatest(FETCH_USERPROFILE_REQUEST, fetchDefaultProfile)
    );
  });

  it('should fork a watcher for updateUserProfile', () => {
    result = rootSaga.next();
    expect(result.value).toEqual(
      takeLatest(UPDATE_USERPROFILE_REQUEST, updateUserProfile)
    );
  });

  it('should fork a watcher for createFavorite', () => {
    result = rootSaga.next();
    expect(result.value).toEqual(
      takeLatest(CREATE_FAVORITE_REQUEST, createFavorite)
    );
  });

  it('should fork a watcher for deleteFavorite', () => {
    result = rootSaga.next();
    expect(result.value).toEqual(
      takeLatest(DELETE_FAVORITE_REQUEST, deleteFavorite)
    );
  });
});
