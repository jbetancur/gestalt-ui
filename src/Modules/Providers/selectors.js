import { createSelector } from 'reselect';
import base64 from 'base-64';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';

const selectEnvSchema = state => state.metaResource.envSchema.schema;
const selectProvider = state => state.metaResource.provider.provider;

export const getCreateProviderModel = createSelector(
  [selectEnvSchema],
  (envSchema) => {
    const model = {
      properties: {
        environment_types: '', // converted to Array on Create
        config: {
          auth: {},
          external_protocol: 'https',
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
    const model = {
      ...provider,
      name: provider.name,
      description: provider.description,
      resource_type: provider.resource_type,
      properties: {
        ...provider.properties,
        environment_types: provider.properties.environment_types || [],
        config: {
          ...provider.properties.config,
          env: {
            public: {},
            private: {},
          },
          networks: JSON.stringify(provider.properties.config.networks),
          extra: JSON.stringify(provider.properties.config.extra),
        },
        linked_providers: provider.properties.linked_providers,
        data: provider.properties.data ? base64.decode(provider.properties.data) : '',
        locations: provider.properties.locations,
        services: provider.properties.services,
      },
    };

    if (provider.properties.config && provider.properties.config.env) {
      model.properties.config.env.public = mapTo2DArray(provider.properties.config.env.public);
      model.properties.config.env.private = mapTo2DArray(provider.properties.config.env.private);
    }

    if (model.properties.environment_types && Array.isArray(model.properties.environment_types)) {
      model.properties.environment_types = model.properties.environment_types.join(',');
    }

    return metaModels.provider.create(model);
  }
);
