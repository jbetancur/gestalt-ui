import { createSelector } from 'reselect';
import { get } from 'lodash';
import containerModel from '../../Containers/models/container';
import providerModel from '../models/provider';

// const selectEnvSchema = state => state.providers.provider.envSchema;
const selectProvider = state => state.providers.provider.provider;
export const selectContainerProvider = state => state.containers.selectedProvider;
export const selectContainer = state => state.providers.container.container;

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

export const getCreateProviderModel = createSelector(
  [],
  () => providerModel.create()
);

export const getEditProviderModel = createSelector(
  [selectProvider],
  (provider) => {
    const { properties } = providerModel.create(provider);
    const model = {
      ...provider,
      properties: {
        ...properties,
      },
    };

    // TODO: We could cast this in the model, but for some reason it does not cast this deep? - I don't feel like dealing with it.
    // We will eventually move to a service based provider making all this moot
    if (get(model, 'properties.services.length')) {
      const container = containerModel.get(properties.services[0].container_spec);
      model.properties.services = [
        {
          ...properties.services[0],
          container_spec: {
            ...container,
            properties: {
              ...container.properties,
              health_checks: fixHealthChecks(container.properties.health_checks),
            },
          },
        },
      ];
    }

    return model;
  }
);

// RAGE
export const getProviderContainer = createSelector(
  [selectProvider],
  (provider) => {
    const model = providerModel.get(provider);

    return (model
      && model.properties
      && model.properties.services
      && model.properties.services.length
      && Object.keys(model.properties.services[0].container_spec).length
      && model.properties.services[0].container_spec
    ) || containerModel.get();
  }
);
