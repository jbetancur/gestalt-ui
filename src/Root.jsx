import '@babel/polyfill';
import 'core-js/fn/array/flat-map';
import 'core-js/web';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from 'styled-components';
import { createBrowserHistory } from 'history';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
// import es from 'react-intl/locale-data/es';
import { I18nextProvider } from 'react-i18next';
import { UpgradeRouter } from 'Modules/Upgrader';
import configureStore from './config/configureStore';
import i18n from './config/configureI18n';
import configureHTTP from './config/configureHTTP';
import App from './App/App';
import { Login, withRestricted } from './Modules/Authentication';
import { LoggingNewPage } from './Modules/Logging';
import NotFound from './App/components/NotFound';
import lightTheme from './themes/light';
import './scss/style.scss';

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: blue,
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory();

// Create our store
const store = configureStore(history);

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
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={lightTheme}>
      <Provider store={store}>
        <IntlProvider locale={language}>
          <I18nextProvider i18n={i18n}>
            <ConnectedRouter history={history}>
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/logs" component={withRestricted(LoggingNewPage)} />
                <Route exact path="/upgrade" component={withRestricted(UpgradeRouter)} />
                <Route exact path="/" component={App} />
                <Route exact path="/404" component={NotFound} />
                <Route path="/:fqon" component={App} />
                <Route exact path="/:fqon/404" component={NotFound} />
                <Route path="/notfound" component={App} />
              </Switch>
            </ConnectedRouter>
          </I18nextProvider>
        </IntlProvider>
      </Provider>
    </ThemeProvider>
  </MuiThemeProvider>
);

ReactDOM.render(
  <Root />,
  document.getElementById('app-root')
);
