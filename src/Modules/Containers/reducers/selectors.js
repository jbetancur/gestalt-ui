import { createSelector } from 'reselect';
// import { get } from 'lodash';
import containerModel from '../models/container';

export const selectProvider = state => state.containers.container.selectedProvider;
export const selectContainers = state => state.containers.containers.containers;
export const selectContainer = state => state.containers.container.container;
export const selectContainerSpec = (state, containerSpec) => containerModel.get(containerSpec);
export const selectEnv = state => state.containers.container.inheritedEnv;

// Volume Module States
export const selectVolumeListing = state => state.volumes.volumeListing.volumes;

const fixHealthChecks = (healthChecks = []) => healthChecks.map((check) => {
  const newcheck = { ...check };

  if (check.protocol !== 'COMMAND') {
    if ('port_index' in newcheck) {
      newcheck.port_type = 'index';
    } else {
      newcheck.port_type = 'number';
    }
  }

  return newcheck;
});

export const getContainers = createSelector(
  [selectContainers],
  // in a containers array labels are still just maps
  // containers => containers.filter(container => !get(container, 'properties.labels.SYSTEM')),
  containers => containers,
);

export const getCreateContainerModel = createSelector(
  [selectContainer, selectProvider, selectEnv],
  (container, provider, env) => {
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
      ...container,
      properties: {
        ...container.properties,
        env,
        network: setDefaultNetwork(),
      },
    };

    return containerModel.initForm(model);
  }
);

export const getEditContainerModel = createSelector(
  [selectContainer],
  (container) => {
    const { properties } = container;
    const model = {
      ...container,
      properties: {
        ...container.properties,
        health_checks: fixHealthChecks(properties.health_checks),
      },
    };

    return containerModel.initForm(model);
  }
);

export const getContainerStatus = createSelector(
  [selectContainer],
  (container) => {
    const { properties: { instances, events, status, status_detail, port_mappings } } = container;

    return {
      instances,
      events,
      status,
      status_detail,
      port_mappings,
    };
  }
);
