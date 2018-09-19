import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import containerModel from '../models/container';
import selectedProvider from './selectedProvider';
import actionsModals from '../ActionModals/reducers';

export default combineReducers({
  selectedProvider,
  actionsModals,
  containers: reducerFactory({
    verbs: ['fetch'],
    key: 'containers',
    category: 'containers',
    model: [],
    unloadOnRouteChange: true,
  }),
  container: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'container',
    category: 'container',
    model: containerModel.get(),
  }),
  containerImport: reducerFactory({
    verbs: ['import'],
    key: 'container',
    category: 'container',
    model: containerModel.get(),
  }),
});
