import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectDatafeed = state => state.metaResource.datafeed.datafeed;

export const getDatafeed = createSelector(
  [selectDatafeed],
  datafeed => metaModels.datafeed.create(datafeed),
);
