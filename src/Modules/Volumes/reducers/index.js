import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import volumeModal from '../models/volume';
import selectedProvider from './selectedProvider';
import volumeListing from './volumeListing';

export default combineReducers({
  selectedProvider,
  volumeListing,
  volumes: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'volumes',
    category: 'volumes',
    model: [],
    unloadOnRouteChange: true,
  }),
  volume: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'volume',
    category: 'volume',
    model: volumeModal.get(),
  }),
});
