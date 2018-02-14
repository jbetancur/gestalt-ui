import * as types from '../actionTypes';

/**
 * unloadResourceTypes
 */
export function unloadResourceTypes() {
  return { type: types.UNLOAD_RESOURCETYPES };
}

/**
 * unloadResourceType
 */
export function unloadResourceType() {
  return { type: types.UNLOAD_RESOURCETYPE };
}

/**
 * fetchResourceTypes
 * @param {string} fqon
 */
export function fetchResourceTypes(fqon, filter) {
  return { type: types.FETCH_RESOURCETYPES_REQUEST, fqon, filter };
}

/**
 * fetchResourceTypesDropDown
 * @param {string} fqon
 */
export function fetchResourceTypesDropDown(fqon) {
  return { type: types.FETCH_RESOURCETYPES_DROPDOWN_REQUEST, fqon };
}

/**
 * fetchResourceType
 * @param {string} fqon
 * @param {string} resourceTypeId
 */
export function fetchResourceType(fqon, resourceTypeId) {
  return { type: types.FETCH_RESOURCETYPE_REQUEST, fqon, resourceTypeId };
}

/**
 * createResourceType
 * @param {string} fqon
 */
export function createResourceType(fqon, payload, onSuccess) {
  return { type: types.CREATE_RESOURCETYPE_REQUEST, fqon, payload, onSuccess };
}

/**
 * udpateResourceType
 * @param {string} fqon
 * @param {string} resourceTypeId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateResourceType(fqon, resourceTypeId, payload, onSuccess) {
  return { type: types.UPDATE_RESOURCETYPE_REQUEST, fqon, resourceTypeId, payload, onSuccess };
}

/**
 * deleteResourceType
 * @param {string} fqon
 * @param {string} resourceTypeId
 * @callbak {*} onSuccess
 */
export function deleteResourceType(fqon, resourceTypeId, onSuccess) {
  return { type: types.DELETE_RESOURCETYPE_REQUEST, fqon, resourceTypeId, onSuccess };
}

/**
 * deleteResourceTypes
 * @param {Array} resourceTypeIds
 * @param {string} fqon
 * @callbak {*} onSuccess
 */
export function deleteResourceTypes(resourceTypeIds, fqon, onSuccess) {
  return { type: types.DELETE_RESOURCETYPES_REQUEST, resourceTypeIds, fqon, onSuccess };
}


export default {
  unloadResourceTypes,
  unloadResourceType,
  fetchResourceTypes,
  fetchResourceTypesDropDown,
  fetchResourceType,
  createResourceType,
  updateResourceType,
  deleteResourceType,
  deleteResourceTypes,
};
