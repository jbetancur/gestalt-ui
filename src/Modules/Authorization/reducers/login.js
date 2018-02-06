import * as types from '../actionTypes';

const initialState = {
  isAuthenticating: false,
  statusText: null,
  token: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_TOKEN_PENDING:
      return {
        ...state,
        isAuthenticating: true,
        statusText: null
      };
    case types.REQUEST_TOKEN_FULFILLED:
      return {
        ...state,
        isAuthenticating: false,
        token: action.payload,
      };
    case types.REQUEST_TOKEN_REJECTED:
      return {
        ...state,
        isAuthenticating: false,
        statusText: (
          action.payload.response.data && action.payload.response.data.error === 'invalid_grant' && action.payload.response.data.code === 400
        ) ? 'Invalid username or password' : `Authentication Error: ${action.payload}`
      };
    default:
      return state;
  }
};
