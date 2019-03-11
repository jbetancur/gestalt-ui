import { createSelector } from 'reselect';
import { listSelectors } from 'Modules/ListFilter';
// import get from 'lodash/get';
import containerModel from '../models/container';

export const selectProvider = state => state.containers.container.selectedProvider;
export const selectContainers = state => listSelectors.filterItems()(state, 'containers.containers.containers');
export const selectContainer = state => state.containers.container.container;
export const selectContainerSpec = (state, containerSpec) => containerModel.get(containerSpec);
export const selectEnv = state => state.containers.container.inheritedEnv;

// Volume Module States
export const selectVolumeListing = state => state.volumes.volumeListing.volumes;

export const getContainers = createSelector(
  [selectContainers],
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
  container => containerModel.initForm(container)
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
