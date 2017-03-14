import {
    FETCH_PROVIDER_PENDING,
    FETCH_PROVIDER_REJECTED,
    FETCH_PROVIDER_FULFILLED,
    CREATE_PROVIDER_PENDING,
    CREATE_PROVIDER_FULFILLED,
    CREATE_PROVIDER_REJECTED,
    PROVIDER_UNLOADED,
} from '../actionTypes';

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
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROVIDER_UNLOADED:
      return initialState;
    case FETCH_PROVIDER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        provider: action.payload
      };
    case FETCH_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case CREATE_PROVIDER_PENDING:
      return {
        ...state,
        pending: true,
      };
    case CREATE_PROVIDER_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        provider: action.payload,
      };
    case CREATE_PROVIDER_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
