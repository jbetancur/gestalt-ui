import { createSelector } from 'reselect';
import { mapTo2DArray } from 'util/helpers/transformations';
import containerModel from './models/container';

export const selectProvider = state => state.containers.container.selectedProvider;
export const selectContainer = state => state.containers.container.container;
export const selectContainerSpec = (state, containerSpec) => containerModel.get(containerSpec);
export const selectEnv = state => state.env.env.env;

// Volume Module States
export const selectVolumeListing = state => state.volumes.volumeListing.volumes;

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

export const getCreateContainerModel = createSelector(
  [selectProvider, selectEnv],
  (provider, env) => {
    const setDefaultNetwork = () => {
      switch (provider.type) {
        case 'DCOS':
          return 'BRIDGE';
        case 'ECS':
          return 'bridge';
        default:
          return 'default';
      }
    };

    const model = {
      properties: {
        env: mapTo2DArray(env, 'name', 'value', { inherited: true }),
        network: setDefaultNetwork(),
      },
    };

    return containerModel.get(model);
  }
);

export const getEditContainerModel = createSelector(
  [selectContainer],
  (container) => {
    const { properties } = container;
    const model = {
      ...container,
      properties: {
        ...properties,
        health_checks: fixHealthChecks(properties.health_checks),
        port_mappings: properties.port_mappings
          .map(port => (!port.type && port.expose_endpoint ? { ...port, type: 'internal' } : port)),
        secrets: properties.secrets,
      },
    };

    return containerModel.get(model);
  }
);
