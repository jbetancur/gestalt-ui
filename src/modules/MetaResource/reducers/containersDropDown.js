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
    case types.FETCH_CONTAINERS_DROPDOWN_REQUEST:
      return {
        ...state,
        pending: true,
        containers: [{ id: '', name: 'fetching containers...' }],
      };
    case types.FETCH_CONTAINERS_DROPDOWN_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        containers: action.payload,
      };
    case types.FETCH_CONTAINERS_DROPDOWN_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

