import * as types from '../actionTypes';

/**
 * fetchSelf
 */
export function fetchSelf() {
  return { type: types.FETCH_SELF_REQUEST };
}

export default {
  fetchSelf,
};
