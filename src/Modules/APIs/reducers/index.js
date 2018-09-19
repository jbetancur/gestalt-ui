import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import apiModel from '../models/api';

export default combineReducers({
  apis: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'apis',
    category: 'apis',
    model: [],
    unloadOnRouteChange: true,
  }),
  api: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'api',
    category: 'api',
    model: apiModel.get(),
  }),
});
