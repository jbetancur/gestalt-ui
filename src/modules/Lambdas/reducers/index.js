import { combineReducers } from 'redux';
import providers from './providers';
import selectedLambdas from './selectedLambdas';
import env from './env';
import executors from './executors';
import theme from './theme';

export default combineReducers({
  providers,
  selectedLambdas,
  env,
  executors,
  theme,
});
