import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  apiEndpoints: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_APIENDPOINTS_REQUEST:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_APIENDPOINTS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoints: action.payload
      };
    case types.FETCH_APIENDPOINTS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    case types.DELETE_APIENDPOINT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_APIENDPOINTS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.DELETE_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true
      };
    case types.DELETE_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

