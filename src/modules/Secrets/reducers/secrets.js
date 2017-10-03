import { removeItem } from 'util/helpers/lists';
import {
  ADD_SECRET,
  REMOVE_SECRET,
  SECRETS_UNLOADED,
} from '../actionTypes';

const initialState = {
  secrets: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SECRETS_UNLOADED:
      return initialState;
    case ADD_SECRET:
      return {
        ...state,
        secrets: [...state.secrets, action.payload],
      };
    case REMOVE_SECRET:
      return {
        ...state,
        secrets: removeItem(state.secrets, action.payload),
      };
    default:
      return state;
  }
};

