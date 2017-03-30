import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  apiEndpoint: {
    created: {},
    modified: {},
    properties: {
      auth_type: {},
    },
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_APIENDPOINT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoint: action.payload
      };
    case types.FETCH_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.CREATE_APIENDPOINT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.CREATE_APIENDPOINT_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        apiEndpoint: action.payload,
      };
    case types.CREATE_APIENDPOINT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
