import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { authActionTypes } from 'Modules/Authentication';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import { DEBUG } from '../constants';
import debounce from './middlewares/debounce';

const sagaMiddleware = createSagaMiddleware();

// Compose all reducers to clear their state on logout
const composeRootReducer = reducer => (state, action) => {
  // Clear the store except for browser state
  if (action.type === authActionTypes.LOGOUT_REQUEST) {
    return reducer(Object.assign({}, { browser: state.browser }), action);
  }

  return reducer(state, action);
};


export default function configureStore(history) {
  let middlewares = [
    sagaMiddleware,
    thunk,
    debounce(),
    routerMiddleware(history),
  ];

  if (DEBUG) {
    // eslint-disable-next-line global-require
    const { createLogger } = require('redux-logger');
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
    composeRootReducer(rootReducer),
    composeWithDevTools(
      responsiveStoreEnhancer,
      applyMiddleware(...middlewares),
    ),
  );

  // run our registered sagas
  sagaMiddleware.run(rootSaga);

  return store;
}
