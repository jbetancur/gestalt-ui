import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ModalProvider } from 'Modules/ModalRoot/ModalContext';
import ModalRoot from 'Modules/ModalRoot/ModalRoot';
import ErrorNotifications from 'Modules/ErrorNotifications';
import { UpgradeNotification, withUpgrader } from 'Modules/Upgrader';
import { Notifications } from 'Modules/Notifications';
import { Navigation, ContextNavigation, ContextRoutes } from 'Modules/Hierarchy';
import { FloatingDrawer } from 'components/NavigationDrawers';
import { FavoriteItems } from 'Modules/UserProfile';
import { ActivityContainer } from 'components/ProgressIndicators';
import withKeyBindings from 'components/Hocs/withKeyBindings';
import { withRestricted } from 'Modules/Authentication';
import { withLicense } from 'Modules/Licensing';
import { AppProvider } from './AppContext';
import AppError from './components/AppError';
import withSelf from './hocs/withSelf';
import actions from './actions';

const konamiCode = ['ctrl+shift+g', 'up up down down left right left right b a enter'];

const AppWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background};
`;

const Main = styled.main`
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.background};
`;

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    keyBindings: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    selfActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    licenseActions: PropTypes.object.isRequired,
    upgraderActions: PropTypes.object.isRequired,
  };

  state = {
    favoritesOpen: false,
    mainNavigationExpanded: false,
    navigationExpanded: false,
    enableExperimental: false,
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
    this.setState(state => ({ enableExperimental: !state.enableExperimental }));
  }

  handleExpandMainNavigation = () => {
    this.setState(state => ({ mainNavigationExpanded: !state.mainNavigationExpanded }));
  }

  handleChangeContext = () => {
    this.setState({ mainNavigationExpanded: false });
  }

  handleExpandNavigation = () => {
    this.setState(state => ({ navigationExpanded: !state.navigationExpanded }));
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
    } = this.props;

    const {
      mainNavigationExpanded,
      navigationExpanded,
      favoritesOpen,
      enableExperimental,
    } = this.state;

    if (selfPending) {
      return <ActivityContainer id="app-main-progess" />;
    }

    if (!self.id) {
      return <AppError onLogout={this.logout} {...this.props} />;
    }

    const initialState = {
      enableExperimental,
      mainNavigationExpanded,
      navigationExpanded,
      favoritesOpen,
      onToggleMainNavigation: this.handleExpandMainNavigation,
      onToggleNavigation: this.handleExpandNavigation,
      onCloseFavorites: this.handleCloseFavorites,
      onToggleFavorites: this.handleToggleFavorites,
      onLogout: this.logout,
    };

    return (
      <AppProvider initialState={initialState}>
        <ModalProvider>
          <ModalRoot />
          <UpgradeNotification />
          <ErrorNotifications />
          <Notifications />
          <FloatingDrawer
            direction="right"
            open={favoritesOpen}
          >
            <FavoriteItems />
          </FloatingDrawer>
          <AppWrapper>
            <Navigation
              open={navigationExpanded}
              onOpen={this.handleExpandNavigation}
            />
            <Main>
              <ContextNavigation
                expanded={mainNavigationExpanded}
                onChangeContext={this.handleChangeContext}
              />
              <ContextRoutes />
            </Main>
          </AppWrapper>
        </ModalProvider>
      </AppProvider>
    );
  }
}

const mapStateToProps = (state) => {
  const { app } = state;

  return {
    appState: {
      activityIndicator: app.activityIndicator.activity,
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
