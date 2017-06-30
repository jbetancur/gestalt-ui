import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { Switch, Route, Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import styled, { ThemeProvider } from 'styled-components';
import cn from 'classnames';
import HierarchyRoot from 'modules/Hierarchy';
import NotFound from 'components/NotFound';
import ProviderRoot from 'modules/Providers';
import UserRoot from 'modules/Users';
import GroupRoot from 'modules/Groups';
import Licensing, { licenseActions } from 'modules/Licensing';
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
import { loginActions } from 'modules/Login';
import { withMetaResource } from 'modules/MetaResource';
import ListItemStacked from 'components/ListItemStacked';
import AppError from '../../components/AppError';
import { UI_VERSION, DOCUMENTATION_URL } from '../../../constants';
import actions from '../../actions';
import lightTheme from '../../../style/themes/light';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    fetchSelf: PropTypes.func.isRequired,
    fetchLicense: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    setCurrentOrgContextfromState: PropTypes.func.isRequired,
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
      // match,
      fetchSelf,
      // setCurrentOrgContextfromState,
      fetchLicense,
    } = this.props;
    // sets our current logged in users home org
    fetchSelf();
    // Check License Status
    fetchLicense('root');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.self !== this.props.self && !this.props.match.params.fqon) {
      this.props.setCurrentOrgContextfromState(nextProps.self.properties.gestalt_home.properties.fqon);
      this.props.history.replace(`/${nextProps.self.properties.gestalt_home.properties.fqon}/hierarchy`);
    }
  }

  getCurrentOrgContext() {
    const { currentOrgContext, self } = this.props;
    // if we don't have an org context then get it from the user self
    // in the future we can map this to a favorite org
    return currentOrgContext.id ? currentOrgContext : self.properties.gestalt_home;
  }

  logout() {
    const { history, logout } = this.props;

    logout();
    // delete local cookie and redirect whether api token delete succeeds or not
    cookie.remove('auth-token', { path: '/' });
    history.replace('/login');
  }

  handleVisibleState(visible) {
    this.setState({ drawerVisible: visible });
  }

  renderNavItems() {
    const { match, t } = this.props;

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
        visible={match.params.fqon === 'root'}
      />,
      <ListItemStacked
        key="groups"
        icon="group"
        title={t('groups.title')}
        component={Link}
        to={`/${this.getCurrentOrgContext().properties.fqon}/groups`}
        activeStyle={{ backgroundColor: 'lightgrey' }}
        visible={match.params.fqon === 'root'}
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
        onClick={() => this.logout()}
      />,
    ];
  }

  renderActionsMenu() {
    const { self, browser, t } = this.props;

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
          to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}/edit`}
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
          onClick={() => this.logout()}
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
              <Switch>
                <Route path={'/:fqon/hierarchy'} component={HierarchyRoot} />
                <Route path={'/:fqon/providers'} component={ProviderRoot} />
                <Route path={'/:fqon/users'} component={UserRoot} />
                <Route path={'/:fqon/groups'} component={GroupRoot} />
                <Route exact path={'/:fqon/license'} component={Licensing} />
                <Route path={'/undefined/hierarchy/*'} component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </NavigationDrawer>
          </ThemeProvider> : <AppError {...this.props} />}
      </main>
    );
  }

  render() {
    return this.props.selfPending ? this.renderProgress() : this.renderMain();
  }
}

function mapStateToProps(state) {
  const { app, browser } = state;

  return {
    activityIndicator: app.activityIndicator.activity,
    browser,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, licenseActions, loginActions))(translate()(App)));
