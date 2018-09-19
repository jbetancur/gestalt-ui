import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import apiEndpointModel from '../models/apiEndpoint';

export default combineReducers({
  apiEndpoints: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'apiEndpoints',
    category: 'apiEndpoints',
    model: [],
    unloadOnRouteChange: true,
  }),
  apiEndpoint: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'apiEndpoint',
    category: 'apiEndpoint',
    model: apiEndpointModel.get(),
  }),
});
