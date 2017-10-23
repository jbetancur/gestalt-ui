import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HierarchyRoot from 'Modules/Hierarchy';
import { licenseActions } from 'Modules/Licensing';
import Toolbar from 'react-md/lib/Toolbars';
import ActivityContainer from 'components/ActivityContainer';
import OrgNavMenu from 'Modules/OrgNavMenu';
import ModalRoot from 'Modules/ModalRoot';
import { loginActions } from 'Modules/Auth';
import { metaActions } from 'Modules/MetaResource';
import { withContext } from 'Modules/ContextManagement';
import Main from './components/Main';
import AppError from './components/AppError';
import AppLogo from './components/AppLogo';
import AppToolbarUserMenu from './components/AppToolbarUserMenu';
import AppToolbarInfoMenu from './components/AppToolbarInfoMenu';
import actions from './actions';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    license: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    syncPending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    activityIndicator: PropTypes.bool.isRequired,
    browser: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { self, meta } = this.props;
    // sets our current logged in users home org
    // this can go away when we implement JWT
    if (!self.id) {
      meta.fetchSelf();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.self.id && nextProps.self.id !== this.props.self.id && !this.props.match.params.fqon) {
      // TODO: routing here must be moved to auth once we refactor Auth/JWT
      this.props.history.replace(`/${nextProps.self.properties.gestalt_home.properties.fqon}/hierarchy`);
      this.props.meta.sync();
      this.props.license.fetchLicense('root');
    }
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
        <Main>
          <Toolbar
            colored
            fixed
            title={<OrgNavMenu />}
            actions={[
              <AppToolbarUserMenu self={self} browser={browser} onLogout={this.logout} />,
              <AppToolbarInfoMenu onShowLicenseModal={license.showLicenseModal} />
            ]}
          >
            <AppLogo visible={browser.greaterThan.sm} />
          </Toolbar>
          <ModalRoot />
          <HierarchyRoot />
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
  const { app, browser, metaResource } = state;

  return {
    self: metaResource.self.self,
    selfPending: metaResource.self.pending,
    syncPending: metaResource.sync.pending,
    activityIndicator: app.activityIndicator.activity,
    browser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    license: bindActionCreators(licenseActions, dispatch),
    auth: bindActionCreators(loginActions, dispatch),
    meta: bindActionCreators(metaActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withContext(App));
