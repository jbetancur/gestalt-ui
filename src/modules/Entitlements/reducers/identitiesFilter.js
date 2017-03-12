import {
  FILTER_IDENTITIES_TEXT,
  FILTER_IDENTITIES_TEXT_CLEAR,
} from '../actionTypes';

const initialState = {
  filterText: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_IDENTITIES_TEXT_CLEAR:
      return initialState;
    case FILTER_IDENTITIES_TEXT: {
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
