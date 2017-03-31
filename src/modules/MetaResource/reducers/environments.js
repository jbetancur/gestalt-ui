import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  environments: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_ENVIRONMENTS:
      return initialState;
    case types.FETCH_ENVIRONMENTS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_ENVIRONMENTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        environments: action.payload,
      };
    case types.FETCH_ENVIRONMENTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

