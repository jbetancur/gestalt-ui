import {
  SELECTED_ACTIONS
} from '../actionTypes';

const initialState = {
  selectedActions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_ACTIONS:
      return {
        ...state,
        selectedActions: action.payload
      };
    default:
      return state;
  }
};
