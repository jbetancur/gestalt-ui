import { createSelector } from 'reselect';
import apiModel from './models/api';

export const selectAPI = state => state.apis.api.api;

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

    return apiModel.create(model);
  }
);
