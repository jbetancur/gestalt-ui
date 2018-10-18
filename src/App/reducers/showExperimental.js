import {
  SHOW_EXPERIMENTAL,
} from '../constants';

const initialState = {
  enabled: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_EXPERIMENTAL:
      return {
        ...state,
        enabled: action.state
      };
    default:
      return state;
  }
};
