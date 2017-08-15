// import { LOCATION_CHANGE } from 'react-router-redux';
import {
  ENVIRONMENTS_NAVIGATION,
  UNLOAD_ENVIRONMENTS_NAVIGATION,
} from '../actionTypes';

const initialState = {
  view: 'containers',
  index: 0,
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
