import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookie';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import { I18nextProvider } from 'react-i18next';
import axios from 'axios';
import ErrorNotifications from 'modules/ErrorNotifications';
import './style/style.scss';
import configureStore from './configureStore';
import { API_URL, API_TIMEOUT } from './constants';
import i18n from './i18n';

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
    // eslint-disable-next-line no-lonely-if
    if (error.response.data.message && error.response.data.message.includes('license.view')) {
      // Nothing for now
    } else {
      store.dispatch({ type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response });
    }
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

const Root = props => (
  <Provider store={store}>
    <IntlProvider locale={language}>
      <I18nextProvider i18n={i18n}>
        <div id="app-wrapper">
          <ErrorNotifications />
          <Router history={history}>
            {props.routes()}
          </Router>
        </div>
      </I18nextProvider>
    </IntlProvider>
  </Provider>
);

Root.propTypes = {
  routes: PropTypes.func.isRequired,
};

export default Root;
