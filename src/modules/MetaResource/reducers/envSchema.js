import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  public: [],
  private: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_ENV_SCHEMA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_ENV_SCHEMA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        public: action.payload.public,
        private: action.payload.private,
      };
    case types.FETCH_ENV_SCHEMA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
