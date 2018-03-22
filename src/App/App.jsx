import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import { ContextRoutes } from 'Modules/Hierarchy';
import { licenseActions } from 'Modules/Licensing';
import { Header } from 'components/Navigation';
import { ActivityContainer } from 'components/ProgressIndicators';
import OrgNavMenu from 'Modules/OrgNavMenu';
import { loginActions } from 'Modules/Authorization';
import { metaActions } from 'Modules/MetaResource';
import Main from './components/Main';
import AppError from './components/AppError';
import AppLogo from './components/AppLogo';
import AppToolbarUserMenu from './components/AppToolbarUserMenu';
import AppToolbarInfoMenu from './components/AppToolbarInfoMenu';
import withApp from './withApp';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    license: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    // actions: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    syncPending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { self, meta } = this.props;
    // sets our current logged in users home org
    // this can go away when we implement JWT
    if (!self.id) {
      meta.fetchSelf();
    }

    // demo konami for showing expermimental features
    Mousetrap.bind(['ctrl+shift+g', 'up up down down left right left right b a enter'], this.showExperimental);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.self.id && nextProps.self.id !== this.props.self.id && !this.props.match.params.fqon) {
      // TODO: routing here must be moved to auth once we refactor Auth/JWT
      this.props.history.replace(`/${nextProps.self.properties.gestalt_home.properties.fqon}/hierarchy`);
      this.props.meta.sync();
      this.props.license.fetchLicense('root');
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(['ctrl+shift+g', 'up up down down left right left right b a enter'], this.showExperimental);
  }


  showExperimental = () => {
    this.props.appActions.showExperimental(true);
  }

  logout = () => {
    const { history, auth } = this.props;

    auth.logout();
    history.replace('/login');
  }

  renderMain() {
    const { self, license, browser } = this.props;

    return (
      self.id ?
        <Main id="app-main">
          <Header
            colored
            fixed
            title={<OrgNavMenu />}
            actions={[
              <AppToolbarUserMenu self={self} browser={browser} onLogout={this.logout} />,
              <AppToolbarInfoMenu onShowLicenseModal={license.showLicenseModal} />
            ]}
          >
            <AppLogo visible={browser.greaterThan.sm} />
          </Header>
          <ContextRoutes />
        </Main> : <AppError onLogout={this.logout} {...this.props} />
    );
  }

  render() {
    const { selfPending, syncPending } = this.props;
    const isPending = selfPending || syncPending;

    return isPending ? <ActivityContainer id="app-main-progess" /> : this.renderMain();
  }
}

function mapStateToProps(state) {
  const { browser, metaResource } = state;

  return {
    self: metaResource.self.self,
    selfPending: metaResource.self.pending,
    syncPending: metaResource.sync.pending,
    browser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    license: bindActionCreators(licenseActions, dispatch),
    auth: bindActionCreators(loginActions, dispatch),
    meta: bindActionCreators(metaActions, dispatch),
  };
}

export default compose(
  withApp,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
