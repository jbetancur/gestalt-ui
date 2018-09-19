import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import providerModel from '../models/provider';

export default combineReducers({
  providers: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'providers',
    category: 'providers',
    model: [],
    unloadOnRouteChange: true,
  }),
  provider: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'provider',
    category: 'provider',
    model: providerModel.get(),
  }),
});
