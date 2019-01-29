import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ModalRoot from 'Modules/ModalRoot';
import ErrorNotifications from 'Modules/ErrorNotifications';
import { UpgradeNotification, withUpgrader } from 'Modules/Upgrader';
import { Notifications } from 'Modules/Notifications';
import { Navigation, ContextRoutes } from 'Modules/Hierarchy';
// import { FloatingDrawer } from 'components/NavigationDrawers';
import { withLicense } from 'Modules/Licensing';
import { ActivityContainer } from 'components/ProgressIndicators';
import withKeyBindings from 'components/Hocs/withKeyBindings';
import { withRestricted } from 'Modules/Authentication';
import { AppProvider } from './AppContext';
import AppError from './components/AppError';
import withSelf from './hocs/withSelf';
import actions from './actions';

const konamiCode = ['ctrl+shift+g', 'up up down down left right left right b a enter'];

const AppWrapper = styled.div`
  z-index: 1;
  display: flex;
  flex: 1;
  overflow: hidden;
`;

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    keyBindings: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    selfActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    licenseActions: PropTypes.object.isRequired,
    upgraderActions: PropTypes.object.isRequired,
  };

  state = {
    favoritesOpen: false,
  }

  componentDidMount() {
    const { self, selfActions, keyBindings } = this.props;
    // sets our current logged in users home org
    // this can go away when we implement JWT
    if (!self.id) {
      selfActions.fetchSelf();
    }

    // demo konami for showing experimental features
    keyBindings.add(konamiCode, this.showExperimental);
  }

  componentDidUpdate(prevProps) {
    const { match, self, history, licenseActions, upgraderActions } = this.props;

    if (!match.params.fqon && self.id && self.id !== prevProps.self.id) {
      // TODO: routing here must be moved to auth once we refactor Auth/JWT
      history.replace(`/${self.properties.gestalt_home.properties.fqon}/hierarchy`);
      // Check license expiration
      licenseActions.fetchLicense('root');
      // Check for available Upgrades
      upgraderActions.fetchUpgradeAvailable();
    }
  }

  showExperimental = () => {
    const { appActions } = this.props;

    appActions.showExperimental(true);
  }

  handleLicenseModel = () => {
    const { licenseActions } = this.props;

    licenseActions.showLicenseModal();
  }

  handleToggleFavorites = () => {
    this.setState(state => ({ favoritesOpen: !state.favoritesOpen }));
  }

  handleCloseFavorites = () => {
    this.setState(({ favoritesOpen: false }));
  }

  logout = () => {
    const { history, authActions } = this.props;

    authActions.logout();
    history.replace('/login');
  }

  render() {
    const {
      self,
      selfPending,
      appActions: { toggleNavigation },
      appState: { navigationExpanded, enableExperimental },
    } = this.props;

    const { favoritesOpen } = this.state;

    if (selfPending) {
      return <ActivityContainer id="app-main-progess" />;
    }

    if (!self.id) {
      return <AppError onLogout={this.logout} {...this.props} />;
    }

    const initialState = {
      enableExperimental,
      navigationExpanded,
      favoritesOpen,
      onCloseFavorites: this.handleCloseFavorites,
      onToggleFavorites: this.handleToggleFavorites,
      onLogout: this.logout,
      onShowLicenseModal: this.handleLicenseModel,
    };

    return (
      <AppProvider initialState={initialState}>
        <UpgradeNotification />
        <ModalRoot />
        <ErrorNotifications />
        <Notifications />
        <AppWrapper>
          <Navigation
            open={navigationExpanded}
            onOpen={toggleNavigation}
          />
          <ContextRoutes />
          {/* <FloatingDrawer
            direction="right"
            open={favoritesOpen}
          /> */}
        </AppWrapper>
      </AppProvider>
    );
  }
}

const mapStateToProps = (state) => {
  const { app } = state;

  return {
    appState: {
      activityIndicator: app.activityIndicator.activity,
      enableExperimental: app.showExperimental.enabled,
      navigationExpanded: app.navigation.expanded,
    }
  };
};

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(actions, dispatch)
});

export default compose(
  withRestricted,
  withSelf,
  withLicense,
  withUpgrader,
  withKeyBindings,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
