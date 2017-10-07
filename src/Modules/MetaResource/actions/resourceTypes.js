import * as types from '../actionTypes';

/**
 * fetchResourceTypes
 * @param {string} fqon
 */
export function fetchResourceTypes(fqon) {
  return { type: types.FETCH_RESOURCETYPES_REQUEST, fqon };
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
  fetchResourceTypes,
  fetchResourceType,
  createResourceType,
  deleteResourceType,
  deleteResourceTypes,
};
