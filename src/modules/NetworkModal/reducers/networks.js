import { removeItem } from 'util/helpers/lists';
import {
  ADD_NETWORK,
  REMOVE_NETWORK,
  NETWORKS_UNLOADED,
} from '../actionTypes';

const initialState = {
  networks: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NETWORKS_UNLOADED:
      return initialState;
    case ADD_NETWORK:
      return {
        ...state,
        networks: [...state.networks, action.payload],
      };
    case REMOVE_NETWORK:
      return {
        ...state,
        networks: removeItem(state.networks, action.payload),
      };
    default:
      return state;
  }
};

