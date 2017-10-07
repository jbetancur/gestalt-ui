import { combineReducers } from 'redux';
import tableSelected from './selected';
import tableSort from './sort';

export default combineReducers({
  tableSelected,
  tableSort,
});
