import { cloneDeep } from 'lodash';
import { arrayToMap } from 'util/helpers/transformations';

function arrayifyish(string) {
  return string.replace(/[\s,]+/g, ',').split(',');
}

/**
 * generateContainerPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {Object} sourcePayload
 * @param {Array} mergeSet
 * @param {Boolean} updateMode
 */
export function generateContainerPayload(sourcePayload, mergeSet = [], updateMode = false) {
  const source = cloneDeep(sourcePayload);

  const payload = {
    name: source.name,
    description: source.description,
    properties: {
      env: arrayToMap(source.properties.env, 'name', 'value'),
      labels: arrayToMap(source.properties.labels, 'name', 'value'),
      volumes: [],
      secrets: [],
      port_mappings: source.properties.port_mappings,
      health_checks: [],
      accepted_resource_roles: [],
      constraints: [],
      provider: source.properties.provider, // deleted in updateMode
      container_type: source.properties.container_type,
      force_pull: source.properties.force_pull,
      cpus: source.properties.cpus,
      memory: source.properties.memory,
      num_instances: source.properties.num_instances,
      network: source.properties.network,
      image: source.properties.image,
      cmd: source.properties.cmd,
      user: source.properties.user,
    },
  };

  // force 1 instance since we disable num_instances field validation (to deal with suspended update case)
  if (payload.properties.num_instances === '') {
    payload.properties.num_instances = 1;
  }

  // Trim the cmd of leading/trailng spaces to prevent container errors
  if (payload.properties.cmd && (payload.properties.cmd.trim() !== payload.properties.cmd)) {
    payload.properties.cmd = payload.properties.cmd.trim();
  }

  if (payload.properties.cmd && !payload.properties.cmd.length > 0) {
    delete payload.properties.cmd;
  }

  // these will be in a string format as a result of redux-form limitations - superced by a future chips component
  if (source.properties.accepted_resource_roles && source.properties.accepted_resource_roles.length) {
    // convert to string if an array (updateMode)
    if (Array.isArray(source.properties.accepted_resource_roles)) {
      payload.properties.accepted_resource_roles = source.properties.accepted_resource_roles.join();
      payload.properties.accepted_resource_roles = arrayifyish(payload.properties.accepted_resource_roles);
    } else {
      payload.properties.accepted_resource_roles = arrayifyish(source.properties.accepted_resource_roles);
    }
  } else {
    delete payload.properties.accepted_resource_roles;
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

  mergeSet.forEach((p) => {
    payload.properties[p.key] = p.value;
  });

  // re-format port mappings
  payload.properties.port_mappings = payload.properties.port_mappings.map((port) => {
    const portPayload = { ...port };

    if (port.virtual_hosts && !Array.isArray(port.virtual_hosts) && port.expose_endpoint) {
      let hosts = port.virtual_hosts;
      hosts = hosts.replace(/[\s,]+/g, ',');

      portPayload.virtual_hosts = hosts.split(',');
    } else {
      delete portPayload.virtual_hosts;
    }

    return portPayload;
  });


  if (updateMode) {
    // we dont want to change the provider on updateMode (i.e. PUT, PATCH container)
    delete payload.properties.provider;
  }

  return payload;
}

export default {
  generateContainerPayload,
};
