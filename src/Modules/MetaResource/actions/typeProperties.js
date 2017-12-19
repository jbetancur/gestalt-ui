import * as types from '../actionTypes';

/**
 * createTypeProperty
 * @param {string} fqon
 */
export function createTypeProperty(fqon, resourceTypeId, payload, onSuccess) {
  return { type: types.CREATE_TYPEPROPERTY_REQUEST, fqon, resourceTypeId, payload, onSuccess };
}

/**
 * udpateResourceType
 * @param {string} fqon
 * @param {string} typePropertyId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateTypeProperty(fqon, typePropertyId, payload, onSuccess) {
  return { type: types.UPDATE_TYPEPROPERTY_REQUEST, fqon, typePropertyId, payload, onSuccess };
}

/**
 * deleteTypeProperty
 * @param {string} fqon
 * @param {string} typePropertyId
 * @callbak {*} onSuccess
 */
export function deleteTypeProperty(fqon, typePropertyId, onSuccess) {
  return { type: types.DELETE_TYPEPROPERTY_REQUEST, fqon, typePropertyId, onSuccess };
}

/**
 * batchUpdate
 * @param {string} fqon
 * @param {Array} operations
 * operations must be in the form of
 * [
        { op: 'PATCH', id: '123', patches: [...RFC 6902 patch ops] },
        { op: 'POST', payload: { } },
        { op: 'DELETE', id: '456' },
    ]
 * @callbak {*} onSuccess
 */
export function batchUpdateTypeProperties(fqon, operations, onSuccess) {
  return { type: types.BATCH_UPDATE_TYPEPROPERTY_REQUEST, fqon, operations, onSuccess };
}

export default {
  createTypeProperty,
  updateTypeProperty,
  deleteTypeProperty,
  batchUpdateTypeProperties,
};
