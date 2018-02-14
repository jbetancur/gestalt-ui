import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const getServiceSpecModel = createSelector(
  [],
  () => metaModels.serviceSpec.get()
);
