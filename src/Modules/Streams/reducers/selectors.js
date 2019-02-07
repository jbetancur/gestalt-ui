import { createSelector } from 'reselect';
import { orderBy } from 'lodash';
import streamSpecMode from '../models/streamSpec';

export const selectStreamSpec = state => state.streamSpecs.streamSpec.streamSpec;

export const getStreamSpec = createSelector(
  [selectStreamSpec],
  streamSpec => streamSpecMode.initForm(streamSpec),
);

export const getStreamInstances = createSelector(
  [selectStreamSpec],
  streamSpec => orderBy(streamSpec.properties.streams),
);
