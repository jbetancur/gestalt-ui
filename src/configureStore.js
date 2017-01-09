import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from './rootReducer';

export default function configureStore(history) {
  const middlewares = [
    thunk,
    logger(),
    routerMiddleware(history),
  ];

  return createStore(
    rootReducer,
    compose(
      responsiveStoreEnhancer,
      applyMiddleware(...middlewares)
    ),
  );
}
