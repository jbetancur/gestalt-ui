import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectAPIEndpoint = state => state.metaResource.apiEndpoint.apiEndpoint;

export const getCreateEndpointModel = createSelector(
  [],
  () => metaModels.apiEndpoint.get()
);

export const getEditEndpointModel = createSelector(
  [selectAPIEndpoint],
  (apiEndpoint) => {
    const model = { ...apiEndpoint };

    // Convert to comma delimted for the SelectionControl
    if (model.properties.methods && Array.isArray(model.properties.methods)) {
      model.properties.methods = model.properties.methods.join(',');
    }

    return metaModels.apiEndpoint.create(model);
  }
);
