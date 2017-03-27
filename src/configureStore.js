import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import { DEBUG } from './constants';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(history) {
  let middlewares = [
    sagaMiddleware,
    thunk,
    routerMiddleware(history),
  ];

  if (DEBUG) {
    // eslint-disable-next-line global-require
    const createLogger = require('redux-logger').createLogger;
    middlewares = [...middlewares, createLogger({ collapsed: true })];
  }

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./rootReducer', () =>
      // eslint-disable-next-line global-require
      createStore.replaceReducer(require('./rootReducer').default)
    );
  }

  const store = createStore(
    rootReducer,
    composeWithDevTools(
      responsiveStoreEnhancer,
      applyMiddleware(...middlewares)
    ),
  );

  // run our registered sagas
  sagaMiddleware.run(rootSaga);

  return store;
}
