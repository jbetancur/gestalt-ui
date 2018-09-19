import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import datafeedModel from '../models/dataFeed';

export default combineReducers({
  datafeeds: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'datafeeds',
    category: 'datafeeds',
    model: [],
    unloadOnRouteChange: true,
  }),
  datafeed: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'datafeed',
    category: 'datafeed',
    model: datafeedModel.get(),
  }),
});
