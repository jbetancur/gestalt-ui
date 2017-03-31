import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  containers: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_CONTAINERS_REQUEST:
      return {
        ...state,
        // eslint-disable-next-line no-unneeded-ternary
        pending: action.isPolling ? false : true, // TODO: polling will be removed when we have SSE
      };
    case types.FETCH_CONTAINERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        containers: action.payload,
      };
    case types.FETCH_CONTAINERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

