import {
  FETCH_ORGSET_PENDING,
  FETCH_ORGSET_FULFILLED,
  FETCH_ORGSET_REJECTED
} from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  items: [],
  item: {
    created: {},
    modified: {},
    properties: {
      env: {}
    }
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORGSET_PENDING:
      return {
        ...state,
        pending: true
      };
    case FETCH_ORGSET_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        item: action.payload.item,
        items: action.payload.items,
      };
    case FETCH_ORGSET_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
};
