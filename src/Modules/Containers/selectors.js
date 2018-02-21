import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';

export const selectContainer = state => state.metaResource.container.container;
export const selectContainerSpec = (state, containerSpec) => metaModels.container.get(containerSpec);
export const selectEnv = state => state.metaResource.env.env;

// TODO: deal with missing volume.type - https://gitlab.com/galacticfog/gestalt-meta/issues/416
const fixVolumes = (volumes = []) => volumes.map((volume) => {
  const newVolume = Object.assign({}, volume);
  if (!volume.type) {
    if (newVolume.persistent && newVolume.persistent.size) {
      newVolume.type = 'persistent';
    } else {
      newVolume.type = 'host';
    }
  }
  return newVolume;
});

const fixHealthChecks = (healthChecks = []) => healthChecks.map((check) => {
  const newcheck = Object.assign({}, check);

  if (!check.protocol !== 'COMMAND') {
    if ('port_index' in newcheck) {
      newcheck.port_type = 'index';
    } else {
      newcheck.port_type = 'number';
    }
  }
  return newcheck;
});

const fixPortMappings = (mappings = []) => mappings.map((mapping) => {
  const newMapping = Object.assign({}, mapping);
  if (!newMapping.type) {
    if (newMapping.expose_endpoint && !('service_port' in newMapping)) {
      newMapping.service_port = 0; // set it to auto/default if missing
    }
  }
  return newMapping;
});

export const getCreateContainerModel = createSelector(
  [selectEnv],
  (env) => {
    const model = {
      properties: {
        env: mapTo2DArray(env, 'name', 'value', { inherited: true })
      }
    };

    return metaModels.container.get(model);
  }
);

export const getEditContainerModel = createSelector(
  [selectContainer],
  (container) => {
    const model = {
      ...container,
      properties: {
        ...container.properties,
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        health_checks: fixHealthChecks(container.properties.health_checks),
        volumes: fixVolumes(container.properties.volumes),
        port_mappings: fixPortMappings(container.properties.port_mappings),
        secrets: container.properties.secrets,
      },
    };

    return metaModels.container.create(model);
  }
);

export const getEditContainerModelAsSpec = createSelector(
  [selectContainerSpec],
  (container) => {
    const model = {
      ...container,
      properties: {
        ...container.properties,
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        health_checks: fixHealthChecks(container.properties.health_checks),
        volumes: fixVolumes(container.properties.volumes),
        port_mappings: fixPortMappings(container.properties.port_mappings),
        secrets: container.properties.secrets
      },
    };

    return metaModels.container.create(model);
  }
);

export const getContainerInstances = createSelector(
  [selectContainer],
  container => metaModels.container.get(container).properties.instances
);
