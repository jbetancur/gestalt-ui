import {
  FETCH_LOGPROVIDER_REQUEST,
  UNLOAD_LOGPROVIDER,
} from './actionTypes';

/**
 * fetchLogProvider
 * @param {string} fqon
 * @param {string} providerId
 * @param {string} logType
 */
export function unloadLogProvider() {
  return { type: UNLOAD_LOGPROVIDER };
}

/**
 * fetchLogProvider
 * @param {string} fqon
 * @param {string} providerId
 * @param {string} logType
 */
export function fetchLogProvider(fqon, providerId, logType) {
  return { type: FETCH_LOGPROVIDER_REQUEST, fqon, providerId, logType };
}

export default {
  fetchLogProvider,
  unloadLogProvider,
};
