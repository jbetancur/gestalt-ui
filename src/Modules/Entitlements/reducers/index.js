import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';

export default combineReducers({
  entitlements: reducerFactory({
    verbs: ['fetch', 'update'],
    key: 'entitlements',
    category: 'entitlements',
    model: [],
  }),
  entitlementIdentities: reducerFactory({
    verbs: ['fetch'],
    key: 'identities',
    category: 'identities',
    model: [],
  }),
});
