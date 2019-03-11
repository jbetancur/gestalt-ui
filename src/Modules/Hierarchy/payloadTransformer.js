import cloneDeep from 'lodash/cloneDeep';
import { arrayToMap } from 'util/helpers/transformations';
import jsonPatch from 'fast-json-patch';

/**
 * generateOrganizationPayload
 * @param {Object} sourcePayload
 */
export function generateOrganizationPayload(sourcePayload) {
  const { name, description, properties } = cloneDeep(sourcePayload);
  return {
    name,
    description,
    properties: {
      env: arrayToMap(properties.env, 'name', 'value'),
    }
  };
}

/**
 * generateOrganizationPatches
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateOrganizationPatches(originalPayload, updatedPayload) {
  const { name, description, properties } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties: {
      env: properties.env,
    }
  };

  return jsonPatch.compare(model, generateOrganizationPayload(updatedPayload));
}

/**
 * generateWorkspacePayload
 * @param {Object} sourcePayload
 */
export function generateWorkspacePayload(sourcePayload) {
  const { name, description, properties } = cloneDeep(sourcePayload);
  return {
    name,
    description,
    properties: {
      env: arrayToMap(properties.env, 'name', 'value'),
    }
  };
}

/**
 * generateWorkspacePatches
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateWorkspacePatches(originalPayload, updatedPayload) {
  const { name, description, properties } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties: {
      env: properties.env,
    }
  };

  return jsonPatch.compare(model, generateWorkspacePayload(updatedPayload));
}

/**
 * generateEnvironmentPayload
 * @param {Object} sourcePayload
 */
export function generateEnvironmentPayload(sourcePayload) {
  const { name, description, properties } = cloneDeep(sourcePayload);
  return {
    name,
    description,
    properties: {
      environment_type: properties.environment_type,
      env: arrayToMap(properties.env, 'name', 'value'),
    }
  };
}

/**
 * generateEnvironmentPatches
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateEnvironmentPatches(originalPayload, updatedPayload) {
  const { name, description, properties } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties: {
      environment_type: properties.environment_type,
      env: properties.env,
    }
  };

  return jsonPatch.compare(model, generateEnvironmentPayload(updatedPayload));
}

export default {
  generateOrganizationPayload,
  generateOrganizationPatches,
  generateWorkspacePayload,
  generateWorkspacePatches,
  generateEnvironmentPayload,
  generateEnvironmentPatches,
};
