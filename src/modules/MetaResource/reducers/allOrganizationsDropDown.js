import { LOCATION_CHANGE } from 'react-router-redux';
import * as metaTypes from '../actionTypes';

const initialState = {
  pending: false,
  completed: false,
  organizations: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case metaTypes.UNLOAD_ALLORGS:
      return initialState;
    case LOCATION_CHANGE:
      return initialState;
    case metaTypes.FETCH_ALLORGS_DROPDOWN_REQUEST:
      return {
        ...state,
        pending: true,
        organizations: [{ name: 'fetching organizations...', value: '' }],
      };
    case metaTypes.FETCH_ALLORGS_DROPDOWN_FULFILLED:
      return {
        ...state,
        pending: false,
        completed: true,
        organizations: action.payload,
      };
    case metaTypes.FETCH_ALLORGS_DROPDOWN_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
