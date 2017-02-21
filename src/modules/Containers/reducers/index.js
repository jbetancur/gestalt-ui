import { combineReducers } from 'redux';
import fetchAll from './containers';
import fetchOne from './container';
import providers from './providers';
import actionsModals from '../ActionModals/reducers';
import env from './env';

export default combineReducers({
  fetchAll,
  fetchOne,
  providers,
  actionsModals,
  env,
});
