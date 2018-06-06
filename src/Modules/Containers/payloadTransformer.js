import { cloneDeep } from 'lodash';
import { arrayToMap } from 'util/helpers/transformations';
import { metaModels } from 'Modules/MetaResource';

function arrayifyish(string) {
  return string.replace(/[\s,]+/g, ',').split(',');
}

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeSet
 * @param {Boolean} updateMode
 */
export function generatePayload(sourcePayload, updateMode = false) {
  const source = cloneDeep(sourcePayload);
  const payload = metaModels.container.create(sourcePayload);
  payload.properties.env = arrayToMap(payload.properties.env, 'name', 'value');
  payload.properties.labels = arrayToMap(payload.properties.labels, 'name', 'value');

  // force 1 instance since we disable num_instances field validation (to deal with suspended update case)
  if (payload.properties.num_instances === '') {
    payload.properties.num_instances = 1;
  }

  // Trim the cmd of leading/trailng spaces to prevent container errors
  if (payload.properties.cmd && (payload.properties.cmd.trim() !== payload.properties.cmd)) {
    payload.properties.cmd = payload.properties.cmd.trim();
  }

  if (!payload.properties.cmd) {
    delete payload.properties.cmd;
  }

  // Same idea as above
  if (source.properties.constraints && source.properties.constraints.length) {
    // convert to string if an array (updateMode)
    if (Array.isArray(source.properties.constraints)) {
      payload.properties.constraints = source.properties.constraints.join();
      payload.properties.constraints = arrayifyish(payload.properties.constraints);
    } else {
      payload.properties.constraints = arrayifyish(source.properties.constraints);
    }
  } else {
    delete payload.properties.constraints;
  }

  // re-format volumes
  payload.properties.volumes = payload.properties.volumes.map((volume) => {
    const volumePayload = { ...volume };

    if (volume.type === 'persistent') {
      delete volumePayload.host_path;
    } else {
      delete volumePayload.persistent;
    }

    return volumePayload;
  });

  // re-format health checks
  payload.properties.health_checks = payload.properties.health_checks.map((healthCheck) => {
    const healthCheckPayload = { ...healthCheck };

    if (healthCheckPayload.port_type === 'index') {
      delete healthCheckPayload.port;
    }

    if (healthCheckPayload.port_type === 'number') {
      delete healthCheckPayload.port_index;
    }

    if (healthCheckPayload.protocol === 'TCP') {
      delete healthCheckPayload.path;
      delete healthCheckPayload.command;
      delete healthCheckPayload.ignore_http_1xx;
    }

    if (healthCheckPayload.protocol === 'HTTP' || healthCheckPayload.protocol === 'HTTPS') {
      delete healthCheckPayload.command;
    }

    if (healthCheckPayload.protocol === 'COMMAND') {
      delete healthCheckPayload.path;
      delete healthCheckPayload.ignore_http_1xx;
      delete healthCheckPayload.port_type;
      delete healthCheckPayload.port_index;
      delete healthCheckPayload.port;
    }

    return healthCheckPayload;
  });

  if (updateMode) {
    // we dont want to change the provider on updateMode (i.e. PUT, PATCH container)
    delete payload.properties.provider;
  }

  return payload;
}

export default {
  generatePayload,
};
