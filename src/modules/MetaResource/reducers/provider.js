import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  provider: {
    created: {},
    modified: {},
    properties: {
      config: {
        auth: {},
        env: {
          private: {},
          public: {},
        },
        networks: []
      },
      linked_providers: [],
      locations: [],
      parent: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.FETCH_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.FETCH_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        provider: action.payload,
      };
    case types.FETCH_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case types.CREATE_PROVIDER_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case types.CREATE_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        provider: action.payload,
      };
    case types.CREATE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
