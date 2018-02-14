import * as types from '../actionTypes';

/**
 * unloadActions
 */
export function unloadServiceSpecs() {
  return { type: types.UNLOAD_SERVICESPECS };
}

/**
 * fetchServiceSpecs
 * @param {string} fqon
 */
export function fetchServiceSpecs(fqon) {
  return { type: types.FETCH_SERVICESPECS_REQUEST, fqon };
}

/**
 * fetchServiceSpecsDropdown
 * @param {string} fqon
 */
export function fetchServiceSpecsDropdown(fqon) {
  return { type: types.FETCH_SERVICESPECS_DROPDOWN_REQUEST, fqon };
}

/**
 * createServiceSpec
 * @param {string} fqon
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createServiceSpec(fqon, payload, onSuccess) {
  return { type: types.CREATE_SERVICESPEC_REQUEST, fqon, payload, onSuccess };
}

export default {
  unloadServiceSpecs,
  fetchServiceSpecs,
  fetchServiceSpecsDropdown,
  createServiceSpec,
};
