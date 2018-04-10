import { takeLatest, fork } from 'redux-saga/effects';
import * as types from '../actionTypes';
import { fetchAll, fetchOne, create, update, deleteOne, deleteMany } from '../lib/factory';

// Watchers
export default function* dataFeedWatchers() {
  yield fork(takeLatest, types.FETCH_DATAFEEDS_REQUEST, fetchAll('DATAFEEDS', 'datafeeds'));
  yield fork(takeLatest, types.FETCH_DATAFEED_REQUEST, fetchOne('DATAFEED', 'datafeeds'));
  yield fork(takeLatest, types.CREATE_DATAFEED_REQUEST, create('DATAFEED', 'datafeeds'));
  yield fork(takeLatest, types.UPDATE_DATAFEED_REQUEST, update('DATAFEED', 'datafeeds'));
  yield fork(takeLatest, types.DELETE_DATAFEED_REQUEST, deleteOne('DATAFEED', 'datafeeds'));
  yield fork(takeLatest, types.DELETE_DATAFEEDS_REQUEST, deleteMany('DATAFEEDS', 'datafeeds'));
}
