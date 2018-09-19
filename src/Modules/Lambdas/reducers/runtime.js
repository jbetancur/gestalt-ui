import {
  SELECT_RUNTIME,
} from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case SELECT_RUNTIME:
      return action.runtime;
    default:
      return state;
  }
};
