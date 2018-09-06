import { combineReducers } from 'redux';
import selectedProvider from './selectedProvider';
import actionsModals from '../ActionModals/reducers';

export default combineReducers({
  selectedProvider,
  actionsModals,
});
