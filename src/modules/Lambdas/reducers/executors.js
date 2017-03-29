import { LOCATION_CHANGE } from 'react-router-redux';
import {
  FETCH_EXECUTORS_REQUEST,
  FETCH_EXECUTORS_FULFILLED,
  FETCH_EXECUTORS_REJECTED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  executors: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case FETCH_EXECUTORS_REQUEST:
      return {
        ...state,
        executors: action.payload,
        pending: true,
      };
    case FETCH_EXECUTORS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        executors: action.payload,
      };
    case FETCH_EXECUTORS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

