import { combineReducers } from 'redux';
import fetchAll from './lambdas';
import fetchOne from './lambda';
import lambdaUpdate from './lambdaUpdate';
import providers from './providers';
import selectedLambdas from './selectedLambdas';
import env from './env';
import executors from './executors';
import theme from './theme';

export default combineReducers({
  fetchAll,
  fetchOne,
  lambdaUpdate,
  providers,
  selectedLambdas,
  env,
  executors,
  theme,
});
