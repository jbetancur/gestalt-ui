import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';

export default combineReducers({
  searchUsers: reducerFactory({
    verbs: ['do'],
    key: 'searchUsers',
    category: 'searchUsers',
    model: [],
  }),
  searchAssets: reducerFactory({
    verbs: ['do'],
    key: 'searchAssets',
    category: 'searchAssets',
    model: [],
  }),
});
