import { cloneDeep } from 'lodash';
import base64 from 'base-64';
import jsonPatch from 'fast-json-patch';
import { arrayToMap } from 'util/helpers/transformations';

/**
 * generateLambdaPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeSet
 * @param {Boolean} updateMode
 */
export function generateLambdaPayload(sourcePayload, updateMode = false) {
  const { name, description, properties } = cloneDeep(sourcePayload);
  const model = {
    name,
    description,
    properties: {
      env: arrayToMap(properties.env, 'name', 'value'),
      headers: properties.headers,
      code_type: properties.code_type,
      code: properties.code,
      compressed: properties.compressed,
      cpus: properties.cpus,
      memory: properties.memory,
      timeout: properties.timeout,
      handler: properties.handler,
      package_url: properties.package_url,
      public: properties.public,
      runtime: properties.runtime,
      provider: properties.provider,
      periodic_info: properties.periodic_info,
    },
  };


  // TODO: fake locations for now
  if (!updateMode) {
    model.properties.provider = { id: model.properties.provider.id, locations: [] };
  }

  // Clean up properties depending on lambda code_type
  if (model.properties.code_type === 'package') {
    delete model.properties.code;
  } else {
    delete model.properties.package_url;
    delete model.properties.compressed;
    model.properties.code = base64.encode(model.properties.code);
  }

  if (model.properties.periodic_info && !model.properties.periodic_info.schedule) {
    delete model.properties.periodic_info.payload;
    delete model.properties.periodic_info.timezone;
  }

  if (model.properties.periodic_info &&
    model.properties.periodic_info.schedule &&
    model.properties.periodic_info.payload &&
    model.properties.periodic_info.payload.data) {
    model.properties.periodic_info.payload.data = base64.encode(model.properties.periodic_info.payload.data);
  }

  return model;
}

/**
 * Generates an array of patch operations
 * @param {Object} originalPayload
 * @param {Object} updatedPayload
 */
export function generateLambdaPatches(originalPayload, updatedPayload) {
  const { name, description, properties } = cloneDeep(originalPayload);
  const model = {
    name,
    description,
    properties: {
      env: properties.env,
      headers: properties.headers,
      code: properties.code,
      code_type: properties.code_type,
      compressed: properties.compressed,
      cpus: properties.cpus,
      memory: properties.memory,
      timeout: properties.timeout,
      handler: properties.handler,
      package_url: properties.package_url,
      public: properties.public,
      runtime: properties.runtime,
      provider: properties.provider,
      periodic_info: properties.periodic_info,
    }
  };

  if (properties.code_type === 'package') {
    delete model.properties.code;
  } else {
    delete model.properties.package_url;
    delete model.properties.compressed;
  }


  return jsonPatch.compare(model, generateLambdaPayload(updatedPayload, true));
}

export default {
  generateLambdaPayload,
  generateLambdaPatches,
};
