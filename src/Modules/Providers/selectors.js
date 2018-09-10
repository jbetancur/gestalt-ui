import { createSelector } from 'reselect';
import base64 from 'base-64';
import { metaModels } from 'Modules/MetaResource';

const selectEnvSchema = state => state.metaResource.envSchema.schema;
const selectProvider = state => state.metaResource.provider.provider;
export const selectContainerProvider = state => state.containers.selectedProvider;
export const selectContainer = state => state.metaResource.container.container;

export const getCreateProviderModel = createSelector(
  [selectEnvSchema],
  (envSchema) => {
    const model = {
      properties: {
        environment_types: '', // converted to Array on Create
        config: {
          env: envSchema,
        },
      },
    };

    return metaModels.provider.get(model);
  }
);

export const getEditProviderModel = createSelector(
  [selectProvider],
  (provider) => {
    const { properties } = metaModels.provider.get(provider);
    const model = {
      ...provider,
      properties: {
        ...properties,
        data: properties.data ? base64.decode(properties.data) : '',
      },
    };

    // TODO: Make CheckBoxGroup accept arrays
    if (model.properties.environment_types && Array.isArray(model.properties.environment_types)) {
      model.properties.environment_types = model.properties.environment_types.join(',');
    }

    // TODO: We could cast this in the model, but for some reason it does not cast this deep? - I don't feel like dealing with it.
    // We will eventually move to a service based provider making all this moot
    if (model.properties.services.length) {
      model.properties.services = [
        {
          ...properties.services[0],
          container_spec: metaModels.container.get(properties.services[0].container_spec),
        }
      ];
    }

    return model;
  }
);

// RAGE
export const getProviderContainer = createSelector(
  [selectProvider],
  (provider) => {
    const model = metaModels.provider.get(provider);

    return (model
      && model.properties
      && model.properties.services
      && model.properties.services.length
      && Object.keys(model.properties.services[0].container_spec).length
      && model.properties.services[0].container_spec
    ) || metaModels.container.get();
  }
);
