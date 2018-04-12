import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectStream = state => state.metaResource.stream.stream;

export const getDatafeed = createSelector(
  [selectStream],
  stream => metaModels.stream.create(stream),
);
