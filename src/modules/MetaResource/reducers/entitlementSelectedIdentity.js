import { LOCATION_CHANGE } from 'react-router-redux';
import * as types from '../actionTypes';

const initialState = {
  identity: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case types.UNLOAD_ENTITLEMENTS:
      return initialState;
    case types.SELECTED_IDENTITY:
      return {
        ...state,
        identity: action.payload,
      };
    default:
      return state;
  }
};
