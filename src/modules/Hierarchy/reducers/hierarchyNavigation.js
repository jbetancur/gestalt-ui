// import { LOCATION_CHANGE } from 'react-router-redux';
import {
  HIERARCHY_NAVIGATION,
  UNLOAD_HIERARCHY_NAVIGATION,
} from '../actionTypes';

const initialState = {
  view: 'hierarchy',
  index: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_HIERARCHY_NAVIGATION:
      return initialState;
    case HIERARCHY_NAVIGATION:
      return {
        ...state,
        view: action.payload.view,
        index: action.payload.index,
      };
    default:
      return state;
  }
};
