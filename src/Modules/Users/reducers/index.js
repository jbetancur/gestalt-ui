import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import userModel from '../models/user';

export default combineReducers({
  users: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'users',
    category: 'users',
    model: [],
    unloadOnRouteChange: true,
  }),
  user: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'user',
    category: 'user',
    model: userModel.get(),
  }),
});
