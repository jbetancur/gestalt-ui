import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectAPI = state => state.metaResource.api.api;

export const getEditAPIModel = createSelector(
  [selectAPI],
  (api) => {
    const model = {
      name: api.name,
      description: api.description,
      properties: {
        ...api.properties,
        provider: {
          ...api.properties.provider,
          locations: api.properties.provider.locations.length && api.properties.provider.locations[0],
        },
      }
    };

    return metaModels.api.create(model);
  }
);
