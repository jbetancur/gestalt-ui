import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import ModalRoot from 'Modules/ModalRoot';
import ErrorNotifications from 'Modules/ErrorNotifications';
import { Notifications } from 'Modules/Notifications';
import { Navigation, ContextNavigation, ContextRoutes } from 'Modules/Hierarchy';
import { withLicense } from 'Modules/Licensing';
import { ActivityContainer } from 'components/ProgressIndicators';
import { withRestricted } from 'Modules/Authentication';
import AppError from './components/AppError';
import withApp from './hocs/withApp';
import withSelf from './hocs/withSelf';

const konamiCode = ['ctrl+shift+g', 'up up down down left right left right b a enter'];

const AppWrapper = styled.div`
  z-index: 1;
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  height: 100%;
`;

const Main = styled.main`
  position: relative;
  overflow-y: scroll;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 56px;
`;

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    selfActions: PropTypes.object.isRequired,
    licenseActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { self, selfActions } = this.props;
    // sets our current logged in users home org
    // this can go away when we implement JWT
    if (!self.id) {
      selfActions.fetchSelf();
    }

    // demo konami for showing experimental features
    Mousetrap.bind(konamiCode, this.showExperimental);
  }

  componentDidUpdate(prevProps) {
    const { match, self, history, licenseActions } = this.props;

    if (!match.params.fqon && self.id && self.id !== prevProps.self.id) {
      // TODO: routing here must be moved to auth once we refactor Auth/JWT
      history.replace(`/${self.properties.gestalt_home.properties.fqon}/hierarchy`);
      licenseActions.fetchLicense('root');
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(konamiCode, this.showExperimental);
  }

  showExperimental = () => {
    const { appActions } = this.props;

    appActions.showExperimental(true);
  }

  logout = () => {
    const { history, authActions } = this.props;

    authActions.logout();
    history.replace('/login');
  }

  renderMain() {
    const {
      self,
      location,
      appActions: { toggleNavigation },
      appState: { navigationExpanded },
    } = this.props;

    if (!self.id) {
      return <AppError onLogout={this.logout} {...this.props} />;
    }

    return (
      <AppWrapper>
        <ModalRoot />
        <ErrorNotifications />
        <Notifications />
        {/* Address blocked updates issue: https://github.com/reduxjs/react-redux/blob/master/docs/troubleshooting.md#my-views-arent-updating-when-something-changes-outside-of-redux */}
        <Navigation
          location={location}
          open={navigationExpanded}
          onOpen={toggleNavigation}
        />
        <Main>
          <div>
            <ContextNavigation />
          </div>

          <ContextRoutes />
        </Main>
      </AppWrapper>
    );
  }

  render() {
    const { selfPending } = this.props;

    return selfPending ? <ActivityContainer id="app-main-progess" /> : this.renderMain();
  }
}

export default compose(
  withRestricted,
  withApp,
  withSelf,
  withLicense,
)(App);
