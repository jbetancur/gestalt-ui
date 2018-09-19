import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import secretModel from '../models/secret';

export default combineReducers({
  secrets: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'secrets',
    category: 'secrets',
    model: [],
    unloadOnRouteChange: true,
  }),
  secret: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'secret',
    category: 'secret',
    model: secretModel.get(),
  }),
});
