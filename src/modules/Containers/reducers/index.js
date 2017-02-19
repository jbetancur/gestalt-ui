import { combineReducers } from 'redux';
import fetchAll from './containers';
import fetchOne from './container';
import providers from './providers';
import actionsModals from '../ActionModals/reducers';

export default combineReducers({
  fetchAll,
  fetchOne,
  providers,
  actionsModals,
});
