import {
  FILTER_AVAILABLE_USERS_TEXT
} from '../actionTypes';

const initialState = {
  filterText: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_AVAILABLE_USERS_TEXT: {
      const { filterText } = action;
      return {
        ...state,
        filterText
      };
    }
    default:
      return state;
  }
};
