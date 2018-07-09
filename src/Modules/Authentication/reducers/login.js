import * as types from '../actionTypes';

const initialState = {
  isAuthenticating: false,
  statusText: null,
  token: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGOUT_FULFILLED:
      return initialState;
    case types.AUTH_TOKEN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        statusText: null
      };
    case types.AUTH_TOKEN_FULFILLED:
      return {
        ...state,
        isAuthenticating: false,
        token: action.payload,
      };
    case types.AUTH_TOKEN_REJECTED:
      return {
        ...state,
        isAuthenticating: false,
        statusText: (action.payload.response
          && action.payload.response.data
          && action.payload.response.data.error === 'invalid_grant'
          && action.payload.response.data.code === 400)
          ? 'Invalid username or password' : `Something went wrong... ${action.payload}`
      };
    default:
      return state;
  }
};
