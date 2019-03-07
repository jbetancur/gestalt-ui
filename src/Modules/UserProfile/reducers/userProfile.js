import { removeItemById } from 'util/helpers/lists';
import {
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
import userProfile from '../models/userProfile';

const initialState = {
  userProfile: userProfile.get(),
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERPROFILE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_USERPROFILE_FULFILLED:
      return {
        ...state,
        userProfile: userProfile.get(action.payload),
        pending: false,
        completed: true,
      };
    case FETCH_USERPROFILE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_FAVORITE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_FAVORITE_FULFILLED:
      return {
        ...state,
        userProfile: userProfile.get(action.payload),
        pending: false,
        completed: true,
      };
    case CREATE_FAVORITE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_USERPROFILE_REQUEST:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_USERPROFILE_FULFILLED:
      return {
        ...state,
        userProfile: userProfile.get(action.payload),
        pending: false,
        completed: true,
      };
    case UPDATE_USERPROFILE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_FAVORITE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_FAVORITE_FULFILLED:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          properties: {
            ...state.userProfile.properties,
            resource_favorites: removeItemById(state.userProfile.properties.resource_favorites, action.payload.id, 'resource_id'),
          },
        },
        pending: false,
        completed: true,
      };
    case DELETE_FAVORITE_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
