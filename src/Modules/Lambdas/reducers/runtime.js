import {
  SELECT_RUNTIME,
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SELECT_RUNTIME:
      return action.runtime;
    default:
      return state;
  }
};
