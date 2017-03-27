import * as metaTypes from 'modules/MetaResource/actionTypes';

const initialState = {
  pending: false,
  completed: false,
  error: null,
  self: {
    properties: {
      gestalt_home: {
        org: {},
        created: {},
        modified: {},
        properties: {
          env: {}
        },
      }
    }
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case metaTypes.FETCH_SELF_PENDING:
      return {
        ...state,
        pending: true
      };
    case metaTypes.FETCH_SELF_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        self: action.payload
      };
    case metaTypes.FETCH_SELF_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
