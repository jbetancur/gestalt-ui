import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import policyModel from '../models/policy';

export default combineReducers({
  policies: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'policies',
    category: 'policies',
    model: [],
    unloadOnRouteChange: true,
  }),
  policy: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'policy',
    category: 'policy',
    model: policyModel.get(),
  }),
});
