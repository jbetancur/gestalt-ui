import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import styled, { ThemeProvider } from 'styled-components';
import cn from 'classnames';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import Divider from 'react-md/lib/Dividers';
import CircularActivity from 'components/CircularActivity';
import OrgNavMenu from 'modules/OrgNavMenu';
import ModalRoot from 'modules/ModalRoot';
import LoginModal from 'modules/Login/components/LoginModal';
import { GestaltIcon, USEnglishLangIcon, HierarchyIcon, ProviderIcon } from 'components/Icons';
import { licenseActions } from 'modules/Licensing';
import { loginActions } from 'modules/Login';
import { metaActions } from 'modules/MetaResource';
import ListItemStacked from 'components/ListItemStacked';
import AppError from '../../components/AppError';
import { UI_VERSION, DOCUMENTATION_URL } from '../../../constants';
import * as actions from '../../actions';
import lightTheme from '../../../style/themes/light';

class App extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    fetchSelf: PropTypes.func.isRequired,
    fetchLicense: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.object,
    selfFetching: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    setCurrentOrgContextfromState: PropTypes.func.isRequired,
    setCurrentWorkspaceContextfromState: PropTypes.func.isRequired,
    setCurrentEnvironmentContextfromState: PropTypes.func.isRequired,
    activityIndicator: PropTypes.bool.isRequired,
    browser: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: {},
  }

  constructor(props) {
    super(props);

    this.state = { drawerVisible: false };
  }

  componentDidMount() {
    const {
      params,
      fetchSelf,
      setCurrentOrgContextfromState,
      setCurrentWorkspaceContextfromState,
      setCurrentEnvironmentContextfromState,
      fetchLicense,
    } = this.props;
    // sets our current logged in users home org
    fetchSelf();
    // Check License Status
    fetchLicense('root');
    // we have to make an additional call here to set the currentOrgState
    // This is mainly to appease browser refresh where we lose currentOrg state and wont run when there is blank fqon in the url
    if (params.fqon) {
      setCurrentOrgContextfromState(params.fqon);
    }

    // do the same for workspaces
    if (params.fqon && params.workspaceId) {
      setCurrentWorkspaceContextfromState(params.fqon, params.workspaceId);
    }

    // do the same for environments
    if (params.fqon && params.workspaceId && params.environmentId) {
      setCurrentEnvironmentContextfromState(params.fqon, params.environmentId);
    }
  }

  componentWillReceiveProps(nextProps) {
    // where there is no fqon in the url set the current org context to gestalt_home - we can later manage this in a user profile setting
    if (nextProps.self !== this.props.self && !this.props.params.fqon) {
      this.props.setCurrentOrgContextfromState(nextProps.self.properties.gestalt_home.properties.fqon);
      // Set Initial route - we can later manage this in a user profile setting
      this.props.router.replace(`${nextProps.self.properties.gestalt_home.properties.fqon}/hierarchy`);
    }
  }

  getCurrentOrgContext() {
    const { currentOrgContext, self } = this.props;
    // if we don't have an org context then get it from the user self
    // in the future we can map this to a favorite org
    return currentOrgContext.id ? currentOrgContext : self.properties.gestalt_home;
  }

  handleVisibleState(visible) {
    this.setState({ drawerVisible: visible });
  }

  renderNavItems() {
    const { params, t, logout } = this.props;

    return [
      <ListItemStacked
        key="hierarchy"
        icon={<HierarchyIcon />}
        title={t('organizations.title')}
        component={Link}
        to={`/${this.getCurrentOrgContext().properties.fqon}/hierarchy`}
        activeStyle={{ backgroundColor: 'lightgrey' }}
      />,
      <ListItemStacked
        key="providers"
        icon={<ProviderIcon />}
        title={t('providers.title')}
        component={Link}
        to={`/${this.getCurrentOrgContext().properties.fqon}/providers`}
        activeStyle={{ backgroundColor: 'lightgrey' }}
      />,
      <ListItemStacked
        key="users"
        icon="person"
        title={t('users.title')}
        component={Link}
        to={`/${this.getCurrentOrgContext().properties.fqon}/users`}
        activeStyle={{ backgroundColor: 'lightgrey' }}
        visible={params.fqon === 'root'}
      />,
      <ListItemStacked
        key="groups"
        icon="group"
        title={t('groups.title')}
        component={Link}
        to={`/${this.getCurrentOrgContext().properties.fqon}/groups`}
        activeStyle={{ backgroundColor: 'lightgrey' }}
        visible={params.fqon === 'root'}
      />,
      <Divider key="navbar-section-divider-1" />,
      <ListItemStacked
        key="licensing"
        icon="vpn_key"
        title="Licensing"
        component={Link}
        to={`/${this.getCurrentOrgContext().properties.fqon}/license`}
        activeStyle={{ backgroundColor: 'lightgrey' }}
      />,
      <ListItemStacked
        key="docs"
        icon="library_books"
        title={t('documentation.title')}
        component={styled.a`text-decoration: none;`}
        href={DOCUMENTATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        inkDisabled
      />,
      <ListItemStacked
        key="logout"
        icon="power_settings_new"
        title={t('auth.logout')}
        style={{ position: 'absolute', bottom: '1em', width: '100%' }}
        inkDisabled
        onClick={() => logout()}
      />,
    ];
  }

  renderActionsMenu() {
    const { self, browser, logout, t } = this.props;

    const renderAvatar = iconSized =>
      <Avatar iconSized={iconSized}>{self.name && self.name.substring(0, 1).toUpperCase()}</Avatar>;

    return [
      <OrgNavMenu {...this.props} />,
      <MenuButton
        id="main-menu"
        flat={browser.greaterThan.xs}
        icon={browser.lessThan.sm}
        label={browser.greaterThan.xs && self.name}
        buttonChildren={browser.lessThan.sm ? 'person' : 'expand_more'}
        position={MenuButton.Positions.TOP_RIGHT}
        iconBefore={false}
      >
        <ListItem
          id="main-menu--profile"
          primaryText={self.name || ''}
          leftAvatar={renderAvatar(true)}
          component={Link}
          to={`${self.properties.gestalt_home.properties.fqon}/users/${self.id}/edit`}
        />
        <ListItem
          id="main-menu--locale"
          primaryText={t('general.nouns.language')}
          leftIcon={<FontIcon>language</FontIcon>}
          nestedItems={[
            <ListItem
              primaryText="English"
              leftIcon={<USEnglishLangIcon />}
              key={0}
              onClick={() => i18next.changeLanguage('en')}
            />,
          ]}
        />
        <ListItem
          className="gf-caption"
          primaryText={`Ui v${UI_VERSION}`}
          leftIcon={<FontIcon>info_outline</FontIcon>}
        />
        <Divider />
        <ListItem
          id="main-menu--logout"
          primaryText={t('auth.logout')}
          leftIcon={<FontIcon>power_settings_new</FontIcon>}
          onClick={() => logout()}
        />
      </MenuButton>,
    ];
  }

  renderProgress() {
    return <CircularActivity id="app-main-progess" />;
  }

  renderAppLogo() {
    const logoClass = cn({
      logo: true,
      'logo-loading': this.props.activityIndicator,
    });

    return (
      this.props.browser.greaterThan.sm &&
        <div className="flex-row center-center no-gutter logo-container">
          <div className="flex-row center-center no-gutter flex-12 logo-container">
            <div className={logoClass}><GestaltIcon /></div>
          </div>
        </div>
    );
  }

  renderMain() {
    return (
      <main>
        {this.props.self.id ? // self must be present to render ui
          <ThemeProvider theme={lightTheme}>
            <NavigationDrawer
              // drawerTitle={this.renderAppLogo()}
              toolbarTitle={this.renderAppLogo()}
              autoclose
              navItems={this.renderNavItems()}
              mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
              tabletDrawerType={NavigationDrawer.DrawerTypes.CLIPPED}
              desktopDrawerType={NavigationDrawer.DrawerTypes.CLIPPED}
              toolbarActions={this.renderActionsMenu()}
              onVisibilityToggle={visible => this.handleVisibleState(visible)}
              includeDrawerHeader={false}
            >
              <LoginModal />
              <ModalRoot />
              {this.props.children}
            </NavigationDrawer>
          </ThemeProvider> : <AppError {...this.props} />}
      </main>
    );
  }

  render() {
    return this.props.selfFetching ? this.renderProgress() : this.renderMain();
  }
}

function mapStateToProps(state) {
  const { app, metaResource, browser } = state;

  return {
    self: metaResource.self.self,
    selfFetching: metaResource.self.pending,
    currentOrgContext: metaResource.currentOrgContext.organization,
    activityIndicator: app.activityIndicator.activity,
    browser,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, licenseActions, loginActions))(translate()(App));
