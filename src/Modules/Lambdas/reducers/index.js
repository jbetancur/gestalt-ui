import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import lambdaModel from '../models/lambda';
import runtime from './runtime';

export default combineReducers({
  runtime,
  lambdas: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'lambdas',
    category: 'lambdas',
    model: [],
    unloadOnRouteChange: true,
  }),
  lambda: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'lambda',
    category: 'lambda',
    model: lambdaModel.get(),
  }),
});
