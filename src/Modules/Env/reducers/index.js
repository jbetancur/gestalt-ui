import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import envSchemaModel from '../models/envSchema';

export default combineReducers({
  env: reducerFactory({
    verbs: ['fetch'],
    key: 'env',
    category: 'env',
    model: {},
  }),
  envSchema: reducerFactory({
    verbs: ['fetch'],
    key: 'schema',
    category: 'ENVSCHEMA',
    model: envSchemaModel.get(),
  }),
});
