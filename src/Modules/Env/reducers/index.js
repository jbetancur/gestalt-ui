import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';

export default combineReducers({
  env: reducerFactory({
    verbs: ['fetch'],
    key: 'env',
    category: 'env',
    model: {},
  }),
});
