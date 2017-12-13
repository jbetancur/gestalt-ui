import { cloneDeep } from 'lodash';

/**
 * generateResourcePayload
 * @param {Object} sourcePayload
 */
export function generateResourcePayload(sourcePayload, resourceTypeName) {
  const { name, description, properties } = cloneDeep(sourcePayload);

  return {
    name: `${resourceTypeName}::${name}`,
    description,
    ...properties,
  };
}
