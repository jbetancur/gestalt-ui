import {
  CREATE_APPDEPLOYMENT_REQUEST,
  CREATE_APPDEPLOYMENT_FULFILLED,
  CREATE_APPDEPLOYMENT_REJECTED,
  UNLOAD_APPDEPLOYMENT,
} from '../actionTypes';

const initialState = {
  appDeployment: {},
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_APPDEPLOYMENT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_APPDEPLOYMENT_FULFILLED:
      return {
        ...state,
        appDeployment: action.payload,
        pending: false,
        completed: true,
      };
    case CREATE_APPDEPLOYMENT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_APPDEPLOYMENT:
      return initialState;
    default:
      return state;
  }
};
