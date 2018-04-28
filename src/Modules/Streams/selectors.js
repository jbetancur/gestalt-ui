import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectStreamSpec = state => state.metaResource.streamSpec.streamSpec;

export const getStreamSpec = createSelector(
  [selectStreamSpec],
  streamSpec => metaModels.streamSpec.create(streamSpec),
);

export const getStreamInstances = createSelector(
  [selectStreamSpec],
  streamSpec => metaModels.streamSpec.get(streamSpec).properties.streams,
);
