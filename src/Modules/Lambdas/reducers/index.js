import { combineReducers } from 'redux';
import theme from './theme';
import runtime from './runtime';

export default combineReducers({
  theme,
  runtime,
});
