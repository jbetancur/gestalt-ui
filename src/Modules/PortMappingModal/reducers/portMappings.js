import { removeItem } from 'util/helpers/lists';
import {
  ADD_PORTMAPPING,
  REMOVE_PORTMAPPING,
  UNLOAD_PORTMAPPINGS,
} from '../actionTypes';

const initialState = {
  portMappings: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_PORTMAPPINGS:
      return initialState;
    case ADD_PORTMAPPING:
      return {
        ...state,
        portMappings: [...state.portMappings, action.payload],
      };
    case REMOVE_PORTMAPPING:
      return {
        ...state,
        portMappings: removeItem(state.portMappings, action.payload),
      };
    default:
      return state;
  }
};

