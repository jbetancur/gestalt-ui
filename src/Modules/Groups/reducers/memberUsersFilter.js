import {
  FILTER_MEMBER_USERS_TEXT
} from '../actionTypes';

const initialState = {
  filterText: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_MEMBER_USERS_TEXT: {
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
