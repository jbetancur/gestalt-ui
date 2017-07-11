import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import { I18nextProvider } from 'react-i18next';
import ErrorNotifications from 'modules/ErrorNotifications';
import configureStore from './configureStore';
import i18n from './i18n';
import App from './App';
import { Login, restricted } from './modules/Auth';
import Logging from './modules/Logging';
import configureHTTP from './configureHTTP';
import './style/style.scss';

// Create our store
const store = configureStore();

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Add http request/response interceptors
configureHTTP(store, history);

// Locale
// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

addLocaleData([...en, ...es]);

const Root = () => (
  <Provider store={store}>
    <IntlProvider locale={language}>
      <I18nextProvider i18n={i18n}>
        <div id="app-wrapper">
          <ErrorNotifications />
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/logs" component={restricted(Logging)} />
              <Route exact path="/" component={restricted(App)} />
              <Route path="/:fqon" component={restricted(App)} />
            </Switch>
          </ConnectedRouter>
        </div>
      </I18nextProvider>
    </IntlProvider>
  </Provider>
);

export default Root;
