import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectStreamSpec = state => state.metaResource.streamSpec.streamSpec;

export const getStreamSpec = createSelector(
  [selectStreamSpec],
  streamSpec => metaModels.streamSpec.create(streamSpec),
);
