import * as types from '../actionTypes';

/**
 * sync
 */
export function sync() {
  return { type: types.CREATE_SYNC_REQUEST };
}

export default {
  sync,
};
