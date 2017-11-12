import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';

export const selectContainer = state => state.metaResource.container.container;
export const selectEnv = state => state.metaResource.env.env;

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
        health_checks: [],
        instances: [],
        port_mappings: [],
        volumes: [],
        secrets: [],
        provider: {
          locations: [],
        },
        force_pull: false,
        cpus: 0.1,
        memory: 128,
        num_instances: 1,
      },
    };

    return model;
  }
);

export const getEditContainerModel = createSelector(
  [selectContainer],
  (container) => {
    const model = {
      ...metaModels.container,
      name: container.name,
      description: container.description,
      properties: {
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        container_type: container.properties.container_type,
        accepted_resource_roles: container.properties.accepted_resource_roles,
        constraints: container.properties.constraints,
        health_checks: container.properties.health_checks,
        instances: container.properties.instances,
        port_mappings: container.properties.port_mappings,
        volumes: container.properties.volumes,
        secrets: container.properties.secrets || [],
        provider: container.properties.provider,
        force_pull: container.properties.force_pull,
        cpus: container.properties.cpus,
        memory: container.properties.memory,
        num_instances: container.properties.num_instances,
        network: container.properties.network,
        image: container.properties.image,
        cmd: container.properties.cmd,
        user: container.properties.user,
      },
    };

    return model;
  }
);
