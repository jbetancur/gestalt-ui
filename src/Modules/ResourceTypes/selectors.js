import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectResourceType = state => state.metaResource.resourceType.resourceType;

export const getCreateResourceTypeModel = createSelector(
  [],
  () => {
    const model = {
      ...metaModels.resourceType,
    };

    return model;
  }
);

export const getEditResourceTypeModel = createSelector(
  [selectResourceType],
  (resourceType) => {
    const model = {
      ...metaModels.resourceType,
      ...resourceType,
    };

    return model;
  }
);
