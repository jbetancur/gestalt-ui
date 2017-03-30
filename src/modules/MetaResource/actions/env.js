import * as types from '../actionTypes';

export function fetchEnv(fqon, entityId, entityKey) {
  return { type: types.FETCH_ENV_REQUEST, fqon, entityId, entityKey };
}

export default {
  fetchEnv,
};
