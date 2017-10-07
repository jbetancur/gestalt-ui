import * as types from '../actionTypes';

/**
 * fetchLogProvider
 * @param {string} fqon
 * @param {string} providerId
 * @param {string} logType
 */
export function fetchLogProvider(fqon, providerId, logType) {
  return { type: types.FETCH_LOGPROVIDER_REQUEST, fqon, providerId, logType };
}

export default {
  fetchLogProvider,
};
