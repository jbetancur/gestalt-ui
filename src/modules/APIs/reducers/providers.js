import {
  FETCH_PROVIDERS_PENDING,
  FETCH_PROVIDERS_FULFILLED,
  FETCH_PROVIDERS_REJECTED,
  API_UNLOADED,
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  providers: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case API_UNLOADED:
      return initialState;
    case FETCH_PROVIDERS_PENDING:
      return {
        ...state,
        providers: action.payload,
        pending: true,
      };
    case FETCH_PROVIDERS_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        providers: action.payload,
      };
    case FETCH_PROVIDERS_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

