import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import streamSpecModel from '../models/streamSpec';

export default combineReducers({
  streamSpecs: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'streamSpecs',
    category: 'streamSpecs',
    model: [],
    unloadOnRouteChange: true,
  }),
  streamSpec: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'streamSpec',
    category: 'streamSpec',
    model: streamSpecModel.get(),
  }),
});
