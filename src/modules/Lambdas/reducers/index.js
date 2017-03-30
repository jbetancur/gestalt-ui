import { combineReducers } from 'redux';
import selectedLambdas from './selectedLambdas';
import theme from './theme';

export default combineReducers({
  selectedLambdas,
  theme,
});
