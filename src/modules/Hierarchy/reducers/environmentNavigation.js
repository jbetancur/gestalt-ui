// import { LOCATION_CHANGE } from 'react-router-redux';
import {
  ENVIRONMENTS_NAVIGATION,
  UNLOAD_ENVIRONMENTS_NAVIGATION,
} from '../actionTypes';

const initialState = {
  view: '',
  index: -1, // should be plus 1 the total tabs
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_ENVIRONMENTS_NAVIGATION:
      return initialState;
    case ENVIRONMENTS_NAVIGATION:
      return {
        ...state,
        view: action.payload.view,
        index: action.payload.index,
      };
    default:
      return state;
  }
};
