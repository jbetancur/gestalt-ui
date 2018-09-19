import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';

export default combineReducers({
  logProvider: reducerFactory({
    verbs: ['fetch'],
    key: 'logProvider',
    category: 'logprovider',
    model: { provider: {}, url: '' },
  }),
});
