import {
  SELECTED_IDENTITY,
  ENTITLEMENTS_UNLOADED,
} from '../actionTypes';

const initialState = {
  identity: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTITLEMENTS_UNLOADED:
      return initialState;
    case SELECTED_IDENTITY:
      return {
        ...state,
        identity: action.payload,
      };
    default:
      return state;
  }
};
