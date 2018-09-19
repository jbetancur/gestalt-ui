import { createSelector } from 'reselect';
import apiEndpointModel from './models/apiEndpoint';

export const selectAPIEndpoint = state => state.apiEndpoints.apiEndpoint.apiEndpoint;

export const getCreateEndpointModel = createSelector(
  [],
  () => apiEndpointModel.get()
);

export const getEditEndpointModel = createSelector(
  [selectAPIEndpoint],
  (apiEndpoint) => {
    const model = { ...apiEndpoint };

    // Convert to comma delimted for the SelectionControl
    if (model.properties.methods && Array.isArray(model.properties.methods)) {
      model.properties.methods = model.properties.methods.join(',');
    }

    return apiEndpointModel.create(model);
  }
);
