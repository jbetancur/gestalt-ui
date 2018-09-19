import { createSelector } from 'reselect';
import streamSpecModel from './models/streamSpec';

export const selectStreamSpec = state => state.streamSpecs.streamSpec.streamSpec;

export const getStreamSpec = createSelector(
  [selectStreamSpec],
  streamSpec => streamSpecModel.create(streamSpec),
);

export const getStreamInstances = createSelector(
  [selectStreamSpec],
  streamSpec => streamSpecModel.get(streamSpec).properties.streams,
);
