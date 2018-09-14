import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import ModalRoot from 'Modules/ModalRoot';
import ErrorNotifications from 'Modules/ErrorNotifications';
import { Notifications } from 'Modules/Notifications';
import { ContextRoutes } from 'Modules/Hierarchy';
import { withLicense } from 'Modules/Licensing';
import { Header } from 'components/Navigation';
import { ActivityContainer } from 'components/ProgressIndicators';
import { OrganizationMenu } from 'Modules/NavigationMenus';
import { withRestricted } from 'Modules/Authentication';
import { withSelf } from 'Modules/MetaResource';
import { GestaltIcon } from 'components/Icons';
import AppError from './components/AppError';
import AppToolbarUserMenu from './components/AppToolbarUserMenu';
import AppToolbarInfoMenu from './components/AppToolbarInfoMenu';
import withApp from './withApp';

const konamiCode = ['ctrl+shift+g', 'up up down down left right left right b a enter'];

const Main = styled.main`
  height: 100%;
  padding-top: 4.3em;
`;

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    selfActions: PropTypes.object.isRequired,
    licenseActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
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
    const { self, licenseActions, browser } = this.props;

    return (
      self.id ?
        <Main>
          <Header
            colored
            leftContent={
              <React.Fragment>
                <OrganizationMenu />
              </React.Fragment>
            }
            logo={<GestaltIcon size={36} />}
            logoVisible={browser.greaterThan.sm}
            rightContent={
              <React.Fragment>
                <AppToolbarUserMenu self={self} browser={browser} onLogout={this.logout} />
                <AppToolbarInfoMenu onShowLicenseModal={licenseActions.showLicenseModal} />
              </React.Fragment>
            }
          />
          <ContextRoutes />
          <ModalRoot />
          <ErrorNotifications />
          <Notifications />
        </Main> :
        <AppError onLogout={this.logout} {...this.props} />
    );
  }

  render() {
    const { selfPending } = this.props;

    return selfPending ? <ActivityContainer id="app-main-progess" /> : this.renderMain();
  }
}

const mapStateToProps = state => ({
  browser: state.browser,
});

export default compose(
  withRestricted,
  withApp,
  withSelf,
  withLicense,
  connect(mapStateToProps),
)(App);
