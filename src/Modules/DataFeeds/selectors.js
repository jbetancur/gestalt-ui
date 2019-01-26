import { createSelector } from 'reselect';
import dataFeedModel from './models/dataFeed';

export const selectDatafeeds = state => state.dataFeeds.datafeeds.datafeeds;
export const selectDatafeed = state => state.dataFeeds.datafeed.datafeed;

export const getDatafeed = createSelector(
  [selectDatafeed],
  datafeed => dataFeedModel.get(datafeed),
);
