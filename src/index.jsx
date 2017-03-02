import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import axios from 'axios';
import './style/style.scss';
import routes from './routes';
import configureStore from './configureStore';
import { API_URL, API_TIMEOUT } from './constants';
// Create an enhanced history that syncs navigation events with the store
const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

// Axios Defaults
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = API_TIMEOUT;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

// Add a request interceptor
axios.interceptors.request.use((config) => {
  const newConfig = { ...config };

  store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: true });
  newConfig.headers.Authorization = `Bearer ${cookie.load('auth-token')}`;
  return newConfig;
}, (error) => {
  store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: false });

  Promise.reject(error);
});

// Dispatch App Wide Errors via response interceptor for whatever component is listening
axios.interceptors.response.use((config) => {
  store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: false });
  return config;
}, (error) => {
  const validCookie = !!cookie.load('auth-token') || false;
  store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: false });

  if (!validCookie) {
    browserHistory.replace('login');
  } else {
    store.dispatch({ type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response });
  }

  Promise.reject(error);
});

// Locale
// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

addLocaleData([...en, ...es]);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={language}>
      <Router routes={routes(store)} history={history} />
    </IntlProvider>
  </Provider>,
  document.getElementById('app-root'),
);
