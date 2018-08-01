import jsonPatch from 'fast-json-patch';
import { metaModels } from 'Modules/MetaResource';
import { omit } from 'lodash';

/**
 * generatePayload
 * @param {Object} sourcePayload
 */
export function generatePayload(sourcePayload) {
  return metaModels.resourceType.create(sourcePayload);
}

/**
 * generatePatches
 * @param {Object} original
 * @param {Object} updated
 */
export function generatePatches(original, updated) {
  // we need to strip these properties off the model as they are not pached directly
  // TODO: omit tags to force PATCH
  const originalPayload = omit(metaModels.resourceType.create(original), ['extend', 'property_defs', 'tags']);
  const updatedPayload = omit(generatePayload(updated), ['extend', 'property_defs']);

  return jsonPatch.compare(originalPayload, updatedPayload);
}

/**
 * batchTypeProps
 * @param {String} resourceTypeId
 * @param {Array} originalProps
 * @param {Array} currentProps
 */
export function batchTypeProps(resourceTypeId, originalProps, currentProps) {
  const ops = currentProps.map((updatedProp) => {
    const foundOrigProp = originalProps.find(prop => prop.id === updatedProp.id);

    if (updatedProp.id && foundOrigProp.id) {
      const patches = jsonPatch.compare(foundOrigProp, updatedProp);
      return { op: 'PATCH', id: updatedProp.id, patches };
    }

    return { op: 'POST', resourceTypeId, payload: updatedProp };
  });

  originalProps.forEach((oprop) => {
    if (!currentProps.find(cprop => cprop.id === oprop.id)) {
      ops.push({ op: 'DELETE', id: oprop.id });
    }
  });

  return ops;
}
