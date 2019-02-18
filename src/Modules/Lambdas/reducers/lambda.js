import {
  INIT_LAMBDAEDIT_REQUEST,
  INIT_LAMBDACREATE_FULFILLED,
  INIT_LAMBDAEDIT_FULFILLED,
  INIT_LAMBDAEDIT_REJECTED,
  CREATE_LAMBDA_REQUEST,
  CREATE_LAMBDA_FULFILLED,
  CREATE_LAMBDA_REJECTED,
  UPDATE_LAMBDA_REQUEST,
  UPDATE_LAMBDA_FULFILLED,
  UPDATE_LAMBDA_REJECTED,
  DELETE_LAMBDA_REQUEST,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
  UNLOAD_LAMBDA,
} from '../actionTypes';
import lambdaModel from '../models/lambda';

const initialState = {
  providers: [],
  executors: [],
  secrets: [],
  inheritedEnv: [],
  lambda: lambdaModel.get(),
  pending: false,
  completed: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_LAMBDACREATE_FULFILLED:
      return {
        ...state,
        providers: action.payload.providers,
        executors: action.payload.executors,
        secrets: action.payload.secrets,
        inheritedEnv: action.payload.inheritedEnv,
      };
    case INIT_LAMBDAEDIT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case INIT_LAMBDAEDIT_FULFILLED:
      return {
        ...state,
        executors: action.payload.executors,
        secrets: action.payload.secrets,
        lambda: lambdaModel.get(action.payload.lambda, action.payload.inheritedEnv),
        pending: false,
        completed: true,
      };
    case INIT_LAMBDAEDIT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case CREATE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case CREATE_LAMBDA_FULFILLED:
      return {
        ...state,
        lambda: lambdaModel.get(action.payload.lambda, action.payload.inheritedEnv),
        pending: false,
        completed: true,
      };
    case CREATE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case UPDATE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case UPDATE_LAMBDA_FULFILLED:
      return {
        ...state,
        lambda: lambdaModel.get(action.payload.lambda, action.payload.inheritedEnv),
        pending: false,
        completed: true,
      };
    case UPDATE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    case DELETE_LAMBDA_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DELETE_LAMBDA_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
      };
    case DELETE_LAMBDA_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case UNLOAD_LAMBDA:
      return initialState;
    default:
      return state;
  }
};
