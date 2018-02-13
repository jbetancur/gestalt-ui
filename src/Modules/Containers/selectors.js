import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';
import { merge } from 'lodash';

export const selectContainer = state => state.metaResource.container.container;
export const selectContainerSpec = (state, containerSpec) => containerSpec;
export const selectEnv = state => state.metaResource.env.env;
const selectHealthChecks = state => state.healthCheckModal.healthChecks.healthChecks;
const selectSecrets = state => state.secrets.secrets.secrets;

// TODO: deal with missing volume.type - https://gitlab.com/galacticfog/gestalt-meta/issues/416
const fixVolumes = volumes => volumes.map((volume) => {
  const newVolume = volume;
  if (!volume.type) {
    if (volume.persistent && volume.persistent.size) {
      newVolume.type = 'persistent';
    } else {
      newVolume.type = 'host';
    }
  }
  return newVolume;
});

export const getCreateContainerModel = createSelector(
  [selectEnv],
  (env) => {
    const model = {
      name: '',
      properties: {
        container_type: 'DOCKER',
        env: mapTo2DArray(env, 'name', 'value', { inherited: true }),
        labels: [],
        accepted_resource_roles: [],
        constraints: [],
        provider: {
          locations: [],
        },
        force_pull: false,
        cpus: 0.1,
        memory: 128,
        num_instances: 1,
        port_mappings: [],
        health_checks: [],
        volumes: [],
        secrets: [],
      },
    };

    return merge(metaModels.container.get(), model);
  }
);

export const getEditContainerModel = createSelector(
  [selectContainer, selectHealthChecks, selectSecrets],
  (container, volumes, healthChecks, secrets) => {
    const model = {
      name: container.name,
      description: container.description,
      properties: {
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        container_type: container.properties.container_type,
        accepted_resource_roles: container.properties.accepted_resource_roles,
        constraints: container.properties.constraints,
        provider: container.properties.provider,
        force_pull: container.properties.force_pull,
        cpus: container.properties.cpus,
        memory: container.properties.memory,
        num_instances: container.properties.num_instances,
        network: container.properties.network,
        image: container.properties.image,
        cmd: container.properties.cmd,
        user: container.properties.user,
        port_mappings: container.properties.port_mappings,
        health_checks: merge(container.properties.health_checks || [], healthChecks),
        volumes: fixVolumes(container.properties.volumes),
        secrets: merge(container.properties.secrets || [], secrets),
      },
    };

    return merge(metaModels.container.get(), model);
  }
);

export const getEditContainerModelAsSpec = createSelector(
  [selectContainerSpec, selectHealthChecks, selectSecrets],
  (container, volumes, healthChecks, secrets) => {
    const model = {
      name: container.name,
      description: container.description,
      properties: {
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        container_type: container.properties.container_type,
        accepted_resource_roles: container.properties.accepted_resource_roles,
        constraints: container.properties.constraints,
        provider: container.properties.provider,
        force_pull: container.properties.force_pull,
        cpus: container.properties.cpus,
        memory: container.properties.memory,
        num_instances: container.properties.num_instances,
        network: container.properties.network,
        image: container.properties.image,
        cmd: container.properties.cmd,
        user: container.properties.user,
        port_mappings: container.properties.port_mappings || [],
        health_checks: merge(container.properties.health_checks || [], healthChecks),
        volumes: container.properties.volumes || [],
        secrets: merge(container.properties.secrets || [], secrets),
      },
    };

    return merge(metaModels.container.get(), model);
  }
);

export const getContainerInstances = createSelector(
  [selectContainer],
  container => (container && container.properties && container.properties.instances) || []
);

export const getContainerServiceAddresses = createSelector(
  [selectContainer],
  container => (container && container.properties && container.properties.port_mappings) || []
);
