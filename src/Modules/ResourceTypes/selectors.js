import { createSelector } from 'reselect';
import resourceTypeModel from './models/resourceType';

export const selectResourceType = state => state.resourceTypes.resourceType.resourceType;

export const getCreateResourceTypeModel = createSelector(
  [],
  () => resourceTypeModel.get()
);

export const getEditResourceTypeModel = createSelector(
  [selectResourceType],
  resourceType => resourceTypeModel.create(resourceType)
);
