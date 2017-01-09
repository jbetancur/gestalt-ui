import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { IntlProvider } from 'react-intl';
import axios from 'axios';

import './style/style.scss';

import routes from './routes';
import configureStore from './configureStore';

// Create an enhanced history that syncs navigation events with the store
const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

// Axios Defaults
axios.defaults.baseURL = 'https://meta.test.galacticfog.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.timeout = 60000;
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// Add a request interceptor
axios.interceptors.request.use((config) => {
  const newConfig = {
    ...config,
  };
  newConfig.headers.Authorization = `Bearer ${cookie.load('auth-token')}`;
  return newConfig;
}, error => Promise.reject(error));

// Dispatch App Wide Errors via response interceptor for whatever component is listening
axios.interceptors.response.use(null, (error) => {
  store.dispatch({ type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response });
  Promise.reject(error);
});

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <Router routes={routes} history={history} />
    </IntlProvider>
  </Provider>,
  document.getElementById('app-root'),
);
