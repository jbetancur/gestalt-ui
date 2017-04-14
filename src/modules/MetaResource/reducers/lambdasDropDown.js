import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  lambdas: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_LAMBDAS_DROPDOWN_REQUEST:
      return {
        ...state,
        pending: true,
        lambdas: [{ id: '', name: 'fetching lambdas...' }],
      };
    case types.FETCH_LAMBDAS_DROPDOWN_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        lambdas: action.payload,
      };
    case types.FETCH_LAMBDAS_DROPDOWN_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
