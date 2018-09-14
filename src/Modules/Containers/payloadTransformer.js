import { metaModels } from 'Modules/MetaResource';

/**
 * generatePayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Boolean} updateMode
 */
export function generatePayload(sourcePayload, updateMode, containerVolumes = []) {
  let payload = { ...sourcePayload };

  // force 1 instance since we disable num_instances field validation (to deal with suspended update case)
  // we need to convert this before we cast it since the schema exects a Number
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(payload.properties.num_instances) || !payload.properties.num_instances) {
    payload.properties.num_instances = 1;
  }

  if (updateMode) {
    payload = metaModels.container.put(payload);
  } else {
    payload = metaModels.container.create(payload);
  }

  // Trim the cmd of leading/trailng spaces to prevent container errors
  if (payload.properties.cmd && (payload.properties.cmd.trim() !== payload.properties.cmd)) {
    payload.properties.cmd = payload.properties.cmd.trim();
  }

  if (!payload.properties.cmd) {
    delete payload.properties.cmd;
  }

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

  // Add Volumes to the payload from the VolumePanelList
  payload.properties.volumes = containerVolumes;

  return payload;
}

export default {
  generatePayload,
};
