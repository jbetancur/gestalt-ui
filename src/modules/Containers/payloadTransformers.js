import { cloneDeep } from 'lodash';

function arrayifyish(string) {
  return string.replace(/[\s,]+/g, ',').split(',');
}

/**
 * generateContainerPayload
 * Handle Payload formatting/mutations to comply with meta api
 * @param {*} sourcePayload
 * @param {*} updateMode
 * @param {*} volumes
 * @param {*} portMappings
 * @param {*} healthChecks
 */
export function generateContainerPayload(sourcePayload, volumes, portMappings, healthChecks, updateMode) {
  const source = cloneDeep(sourcePayload);

  const payload = {
    name: source.name,
    description: source.description,
    properties: {
      // these are going to be mutated to satisfy meta
      env: {},
      labels: {},
      volumes: [],
      port_mappings: [],
      health_checks: [],
      accepted_resource_roles: [],
      constraints: [],
      provider: source.properties.provider, // deleted in updateMode
      //
      container_type: source.properties.container_type,
      force_pull: source.properties.force_pull,
      cpus: source.properties.cpus,
      memory: source.properties.memory,
      num_instances: source.properties.num_instances,
      network: source.properties.network,
      image: source.properties.image,
      cmd: source.properties.cmd,
      user: source.properties.user,
    }
  };

  if (updateMode) {
    // we dont want to change the provider on updateMode (i.e. PUT, PATCH container)
    delete payload.properties.provider;
  }

  // Convert variables from array back to map on the payload
  if (source.variables) {
    source.variables.forEach((variable) => {
      payload.properties.env[variable.name] = variable.value;
    });
  }

  // Convert labels from array back to map on the payload
  if (source.labels) {
    source.labels.forEach((label) => {
      payload.properties.labels[label.name] = label.value;
    });
  }

  // monkey patch these to the payload
  if (volumes) {
    payload.properties.volumes = volumes;
  }

  if (portMappings) {
    payload.properties.port_mappings = portMappings;
  }

  if (healthChecks) {
    payload.properties.health_checks = healthChecks;
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

  return payload;
}
