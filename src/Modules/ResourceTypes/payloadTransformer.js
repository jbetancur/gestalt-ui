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

