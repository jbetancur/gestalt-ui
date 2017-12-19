import { cloneDeep, omit } from 'lodash';
import jsonPatch from 'fast-json-patch';

/**
 * generateResourcePayload
 * @param {Object} sourcePayload
 */
export function generateResourcePayload(sourcePayload) {
  const { name, description, extend, property_defs, properties } = cloneDeep(sourcePayload);

  return {
    name,
    description,
    extend,
    property_defs,
    properties: {
      ...properties,
    },
  };
}

/**
 * generatePatches
 * @param {Object} original
 * @param {Object} updated
 */
export function generatePatches(original, updated) {
  const { name, description, properties } = cloneDeep(original);
  const updatedPayload = omit(generateResourcePayload(updated), ['extend', 'property_defs']);

  const sourcePayload = {
    name,
    description,
    properties: {
      ...properties,
    },
  };

  return jsonPatch.compare(sourcePayload, updatedPayload);
}

/**
 * batchTypeProps
 * @param {String} resourceTypeId
 * @param {Array} originalProps
 * @param {Array} currentProps
 */
export function batchTypeProps(resourceTypeId, originalProps, currentProps) {
  const ops = currentProps.map((updatedProp) => {
    const foundOrigProp = originalProps.find(o => o.id === updatedProp.id);

    if (updatedProp.id && foundOrigProp.id) {
      const patches = jsonPatch.compare(foundOrigProp, updatedProp);
      return { op: 'PATCH', id: updatedProp.id, patches };
    }

    return { op: 'POST', resourceTypeId, payload: updatedProp };
  });

  originalProps.forEach((prop) => {
    if (!currentProps.find(c => c.id === prop.id)) {
      ops.push({ op: 'DELETE', id: prop.id });
    }
  });

  return ops;
}

