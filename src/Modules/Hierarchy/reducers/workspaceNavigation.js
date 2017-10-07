// import { LOCATION_CHANGE } from 'react-router-redux';
import {
  WORKSPACES_NAVIGATION,
  UNLOAD_WORKSPACES_NAVIGATION,
} from '../actionTypes';

const initialState = {
  view: 'environments',
  index: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_WORKSPACES_NAVIGATION:
      return initialState;
    case WORKSPACES_NAVIGATION:
      return {
        ...state,
        view: action.payload.view,
        index: action.payload.index,
      };
    default:
      return state;
  }
};
