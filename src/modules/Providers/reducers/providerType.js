import {
  SELECTED_PROVIDER_TYPE
} from '../actionTypes';

const initialState = {
  type: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_PROVIDER_TYPE:
      return {
        ...state,
        type: action.payload
      };
    default:
      return state;
  }
};
