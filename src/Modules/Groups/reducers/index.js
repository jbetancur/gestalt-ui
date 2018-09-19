import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import groupModel from '../models/group';

export default combineReducers({
  groups: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'groups',
    category: 'groups',
    model: [],
    unloadOnRouteChange: true,
  }),
  group: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'group',
    category: 'group',
    model: groupModel.get(),
  }),
  groupMembers: reducerFactory({
    verbs: ['add', 'remove'],
    key: 'group',
    category: 'groupmember',
    model: groupModel.get(),
  }),
});
