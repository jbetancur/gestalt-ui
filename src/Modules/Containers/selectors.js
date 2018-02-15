import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';
import { merge } from 'lodash';

export const selectContainer = state => state.metaResource.container.container;
export const selectContainerSpec = (state, containerSpec) => metaModels.container.get(containerSpec);
export const selectEnv = state => state.metaResource.env.env;
const selectHealthChecks = state => state.healthCheckModal.healthChecks.healthChecks;
const selectSecrets = state => state.secrets.secrets.secrets;

// TODO: deal with missing volume.type - https://gitlab.com/galacticfog/gestalt-meta/issues/416
const fixVolumes = (volumes = []) => volumes.map((volume) => {
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
      properties: {
        env: mapTo2DArray(env, 'name', 'value', { inherited: true })
      }
    };

    return metaModels.container.get(model);
  }
);

export const getEditContainerModel = createSelector(
  [selectContainer, selectHealthChecks, selectSecrets],
  (container, volumes, healthChecks, secrets) => {
    const model = {
      ...container,
      properties: {
        ...container.properties,
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        health_checks: merge(container.properties.health_checks || [], healthChecks),
        volumes: fixVolumes(container.properties.volumes),
        secrets: merge(container.properties.secrets || [], secrets),
      },
    };

    return metaModels.container.create(model);
  }
);

export const getEditContainerModelAsSpec = createSelector(
  [selectContainerSpec, selectHealthChecks, selectSecrets],
  (container, volumes, healthChecks, secrets) => {
    const model = {
      ...container,
      properties: {
        ...container.properties,
        env: mapTo2DArray(container.properties.env),
        labels: mapTo2DArray(container.properties.labels),
        health_checks: merge(container.properties.health_checks || [], healthChecks),
        volumes: fixVolumes(container.properties.volumes),
        secrets: merge(container.properties.secrets || [], secrets),
      },
    };

    return metaModels.container.create(model);
  }
);

export const getContainerInstances = createSelector(
  [selectContainer],
  container => metaModels.container.get(container).properties.instances
);
