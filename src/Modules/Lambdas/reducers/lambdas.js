import { removeItem } from 'util/helpers/lists';
import {
  FETCH_LAMBDAS_REQUEST,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDAS_REJECTED,
  DELETE_LAMBDA_REQUEST,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
  DELETE_LAMBDAS_REQUEST, // bulk delete
  UNLOAD_LAMBDAS,
} from '../constants';

const initialState = {
  lambdas: [],
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LAMBDAS_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_LAMBDAS_FULFILLED:
      return {
        ...state,
        lambdas: action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_LAMBDAS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_LAMBDAS_REQUEST:
      return {
        ...state,
        pending: true,
      };

    case DELETE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_LAMBDA_FULFILLED:
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          lambdas: state.lambdas.filter(item => action.payload.find(i => i.id === item.id) !== item),
          pending: false,
          completed: true,
        };
      }
      return {
        ...state,
        lambdas: removeItem(state.lambdas, action.payload),
        pending: false,
        completed: true,
      };
    case DELETE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_LAMBDAS:
      return initialState;
    default:
      return state;
  }
};
