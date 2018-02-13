import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectResourceType = state => state.metaResource.resourceType.resourceType;

export const getCreateResourceTypeModel = createSelector(
  [],
  () => metaModels.resourceType.get()
);

export const getEditResourceTypeModel = createSelector(
  [selectResourceType],
  resourceType => metaModels.resourceType.create(resourceType)
);
