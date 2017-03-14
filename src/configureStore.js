import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';
import { DEBUG } from './constants';

export default function configureStore(history) {
  let middlewares = [
    thunk,
    routerMiddleware(history),
  ];

  if (DEBUG) {
    // eslint-disable-next-line global-require
    const logger = require('redux-logger');
    middlewares = [...middlewares, logger()];
  }

  return createStore(
    rootReducer,
    composeWithDevTools(
      responsiveStoreEnhancer,
      applyMiddleware(...middlewares)
    ),
  );
}
