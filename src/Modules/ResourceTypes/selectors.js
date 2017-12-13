import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';


export const getCreateResourceTypeModel = createSelector(
  [],
  () => {
    const model = {
      ...metaModels.resourceType,
    };

    return model;
  }
);
