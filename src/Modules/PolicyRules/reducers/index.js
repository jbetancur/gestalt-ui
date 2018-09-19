import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import policyRuleModel from '../models/policyRule';
import selectedActions from './selectedActions';

export default combineReducers({
  selectedActions,
  policyRules: reducerFactory({
    verbs: ['fetch', 'delete'],
    key: 'policyRules',
    category: 'policyRules',
    model: [],
    unloadOnRouteChange: true,
  }),
  policyRule: reducerFactory({
    verbs: ['fetch', 'create', 'update'],
    key: 'policyRule',
    category: 'policyRule',
    model: policyRuleModel.get(),
  }),
});
