import {
  FILTER_ALLORGS_TEXT
} from '../actionTypes';

const initialState = {
  filterText: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_ALLORGS_TEXT: {
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
