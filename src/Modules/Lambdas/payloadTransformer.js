import base64 from 'base-64';
import jsonPatch from 'fast-json-patch';
import { arrayToMap } from 'util/helpers/transformations';
import { metaModels } from 'Modules/MetaResource';

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generatePayload(sourcePayload, updateMode = false) {
  const model = metaModels.lambda.create(sourcePayload);
  model.properties.env = arrayToMap(model.properties.env, 'name', 'value');

  if (!updateMode) {
    // TODO: Fake Locations
    model.properties.provider = { id: model.properties.provider.id, locations: [] };

    // strip off value field uniqueness performed in LambdaForm as META expects a specific value (e.g. nodejs vs nodejs---1)
    if (model.properties.runtime) {
      const rindex = model.properties.runtime.indexOf('---');
      model.properties.runtime = model.properties.runtime.substring(0, rindex);
    }
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
export function generatePatches(originalPayload, updatedPayload) {
  const model = metaModels.lambda.create(originalPayload);
  model.properties.env = arrayToMap(model.properties.env, 'name', 'value');

  if (originalPayload.properties.code_type === 'package') {
    delete model.properties.code;
  } else {
    delete model.properties.package_url;
    delete model.properties.compressed;
  }

  return jsonPatch.compare(model, generatePayload(updatedPayload, true));
}

export default {
  generatePayload,
  generatePatches,
};
