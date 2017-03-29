import { LOCATION_CHANGE } from 'react-router-redux';
import {
    FETCH_ENV_REQUEST,
    FETCH_ENV_REJECTED,
    FETCH_ENV_FULFILLED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  env: {},
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case FETCH_ENV_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_ENV_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        env: action.payload
      };
    case FETCH_ENV_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
