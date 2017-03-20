import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR
import Root from './Root';
import routes from './routes';

const render = (appRoutes) => {
  ReactDOM.render(
    <AppContainer>
      <Root routes={appRoutes} />
    </AppContainer>,
    document.getElementById('app-root'),
  );
};

render(routes);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./routes', () => {
    // eslint-disable-next-line global-require
    const newRoutes = require('./routes').default;
    render(newRoutes);
  });
}
