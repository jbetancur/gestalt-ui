import { combineReducers } from 'redux';
// import reducerFactory from 'config/lib/reducerFactory';
import runtime from './runtime';
import lambda from './lambda';
import lambdas from './lambdas';

export default combineReducers({
  runtime,
  lambda,
  lambdas,
});
