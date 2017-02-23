import {
  APP_HTTP_REQUEST,
} from '../actionTypes';

const initialState = {
  activity: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APP_HTTP_REQUEST:
      return {
        ...state,
        activity: action.activity,
      };
    default:
      return state;
  }
};
