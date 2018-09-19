import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import serviceSpecModel from '../models/serviceSpec';

export default combineReducers({
  serviceSpecs: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'serviceSpecs',
    category: 'serviceSpecs',
    model: [],
    unloadOnRouteChange: true,
  }),
  serviceSpec: reducerFactory({
    verbs: ['create', 'update', 'delete'],
    key: 'serviceSpec',
    category: 'serviceSpec',
    model: serviceSpecModel.get(),
  }),
});
