import { cloneDeep } from 'lodash';

/**
 * generateResourcePayload
 * @param {Object} sourcePayload
 */
export function generateResourcePayload(sourcePayload, resourceTypeName) {
  const { name, description, extend, property_defs, properties } = cloneDeep(sourcePayload);

  return {
    name: `${resourceTypeName}::${name}`,
    description,
    extend,
    property_defs,
    properties: {
      ...properties,
    },
  };
}
