import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
// import es from 'react-intl/locale-data/es';
import { I18nextProvider } from 'react-i18next';
import ErrorNotifications from 'Modules/ErrorNotifications';
import ModalRoot from 'Modules/ModalRoot';
import NotFound from 'components/NotFound';
import configureStore from './config/configureStore';
import i18n from './config/configureI18n';
import configureHTTP from './config/configureHTTP';
import App from './App/App';
import { LoginContainer, withRestricted } from './Modules/Authorization';
import Logging from './Modules/Logging';
import lightTheme from './themes/light';
import './scss/style.scss';

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

addLocaleData([...en]);

// Disable scrolling on Number
document.addEventListener('mousewheel', () => {
  const el = document.activeElement;
  if (el.type === 'number') {
    el.blur();
  }
});

const Root = () => (
  <ThemeProvider theme={lightTheme}>
    <Provider store={store}>
      <IntlProvider locale={language}>
        <I18nextProvider i18n={i18n}>
          <React.Fragment>
            <ModalRoot />
            <ErrorNotifications />
            <ConnectedRouter history={history}>
              <Switch>
                <Route exact path="/login" component={LoginContainer} />
                <Route exact path="/logs" component={withRestricted(Logging)} />
                <Route exact path="/" component={App} />
                <Route exact path="/404" component={NotFound} />
                <Route path="/:fqon" component={App} />
                <Route exact path="/:fqon/404" component={NotFound} />
                <Route path="/notfound" component={App} />
              </Switch>
            </ConnectedRouter>
          </React.Fragment>
        </I18nextProvider>
      </IntlProvider>
    </Provider>
  </ThemeProvider>
);

ReactDOM.render(
  <Root />,
  document.getElementById('app-root')
);
