import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import resourceTypeModel from '../models/resourceType';

export default combineReducers({
  resourceTypes: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'resourceTypes',
    category: 'resourceTypes',
    model: [],
    unloadOnRouteChange: true,
  }),
  resourceType: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'resourceType',
    category: 'resourceType',
    model: resourceTypeModel.get(),
  }),
});
