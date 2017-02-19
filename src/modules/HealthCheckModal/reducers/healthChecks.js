import { removeItem } from 'util/helpers/lists';
import {
  ADD_HEALTH_CHECK,
  REMOVE_HEALTH_CHECK,
  HEALTH_CHECKS_UNLOADED,
} from '../actionTypes';

const initialState = {
  healthChecks: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case HEALTH_CHECKS_UNLOADED:
      return initialState;
    case ADD_HEALTH_CHECK:
      return {
        ...state,
        healthChecks: [...state.healthChecks, action.payload],
      };
    case REMOVE_HEALTH_CHECK:
      return {
        ...state,
        healthChecks: removeItem(state.healthChecks, action.payload),
      };
    default:
      return state;
  }
};

