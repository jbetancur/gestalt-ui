import {
  CREATE_TYPEPROPERTY_REQUEST,
  UPDATE_TYPEPROPERTY_REQUEST,
  DELETE_TYPEPROPERTY_REQUEST,
  BATCH_UPDATE_TYPEPROPERTY_REQUEST,
} from './constants';

export function confirmDelete(action, title, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title,
      multipleItems,
      onProceed: action,
    }
  };
}

/**
 * createTypeProperty
 * @param {string} fqon
 */
export function createTypeProperty(fqon, resourceTypeId, payload, onSuccess) {
  return { type: CREATE_TYPEPROPERTY_REQUEST, fqon, resourceTypeId, payload, onSuccess };
}

/**
 * udpateResourceType
 * @param {string} fqon
 * @param {string} typePropertyId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateTypeProperty(fqon, typePropertyId, payload, onSuccess) {
  return { type: UPDATE_TYPEPROPERTY_REQUEST, fqon, typePropertyId, payload, onSuccess };
}

/**
 * deleteTypeProperty
 * @param {string} fqon
 * @param {string} typePropertyId
 * @callbak {*} onSuccess
 */
export function deleteTypeProperty(fqon, typePropertyId, onSuccess) {
  return { type: DELETE_TYPEPROPERTY_REQUEST, fqon, typePropertyId, onSuccess };
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
  return { type: BATCH_UPDATE_TYPEPROPERTY_REQUEST, fqon, operations, onSuccess };
}

export default {
  confirmDelete,
  createTypeProperty,
  updateTypeProperty,
  deleteTypeProperty,
  batchUpdateTypeProperties,
};
