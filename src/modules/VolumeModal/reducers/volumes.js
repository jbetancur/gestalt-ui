import { removeItem } from 'util/helpers/lists';
import {
  ADD_VOLUME,
  REMOVE_VOLUME,
  VOLUMES_UNLOADED,
} from '../actionTypes';

const initialState = {
  volumes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VOLUMES_UNLOADED:
      return initialState;
    case ADD_VOLUME:
      return {
        ...state,
        volumes: [...state.volumes, action.payload],
      };
    case REMOVE_VOLUME:
      return {
        ...state,
        volumes: removeItem(state.volumes, action.payload),
      };
    default:
      return state;
  }
};

