import React, { Component, PropTypes } from 'react';
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
import TooltipFontIcon from 'components/TooltipFontIcon';
import { GestaltIcon, GestaltIconText, USEnglishLangIcon } from 'components/Icons';
import { licenseActions } from 'modules/Licensing';
import { loginActions } from 'modules/Login';
import { metaActions } from 'modules/MetaResource';
import { UI_VERSION, DOCUMENTATION_URL } from '../../../constants';
import * as actions from '../../actions';
import lightTheme from '../../../style/themes/light';

const EnhancedLogoDiv = styled.div`
  text-align: center;
  width: 12em;

  svg {
    width: 4em;
    height: 4em;
  }
`;

const EnhancedUIVersionDiv = styled.div`
  color: ${props => props.theme.fontColor};
  padding-top: 1em;
  /* padding: 1.5em; */
  font-size: .9em;
`;

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

  componentWillMount() {
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
      this.props.router.replace(`${nextProps.self.properties.gestalt_home.properties.fqon}/organizations`);
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
    const { t, logout } = this.props;

    return [
      {
        key: 'organizations',
        primaryText: this.getCurrentOrgContext().description || this.getCurrentOrgContext().name || '',
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/organizations`,
        leftIcon: this.state.drawerVisible ? <FontIcon>domain</FontIcon> : <TooltipFontIcon tooltipPosition="right" tooltipLabel={this.getCurrentOrgContext().description || this.getCurrentOrgContext().name}>domain</TooltipFontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'workspaces',
        primaryText: t('workspaces.title'),
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/workspaces`,
        leftIcon: <FontIcon>work</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'providers',
        primaryText: t('providers.title'),
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/providers`,
        leftIcon: <FontIcon>cloud</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'entitlements',
        primaryText: t('entitlements.title'),
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/entitlements`,
        leftIcon: <FontIcon>security</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'users',
        primaryText: t('users.title'),
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/users`,
        leftIcon: <FontIcon>person</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'groups',
        primaryText: t('groups.title'),
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/groups`,
        leftIcon: <FontIcon>group</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'logout',
        primaryText: t('auth.logout'),
        leftIcon: <FontIcon>power_settings_new</FontIcon>,
        style: { position: 'absolute', bottom: '1em', width: '100%' },
        onClick: () => logout(),
      }
    ];
  }

  renderActionsMenu() {
    const { self, params, browser, logout, t } = this.props;

    const renderAvatar = iconSized =>
      <Avatar iconSized={iconSized}>{self.name && self.name.substring(0, 1).toUpperCase()}</Avatar>;

    return [
      <MenuButton
        id="main-menu"
        flat={browser.greaterThan.xs}
        icon={browser.lessThan.sm}
        label={browser.greaterThan.xs ? self.name : null}
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
        <Divider />
        <ListItem
          id="main-menu--logout"
          primaryText={t('auth.logout')}
          leftIcon={<FontIcon>power_settings_new</FontIcon>}
          onClick={() => logout()}
        />
      </MenuButton>,
      <MenuButton
        id="main"
        icon
        buttonChildren="help_outline"
      >
        <EnhancedLogoDiv>
          <GestaltIconText />
          <EnhancedUIVersionDiv>ui v{UI_VERSION}</EnhancedUIVersionDiv>
        </EnhancedLogoDiv>
        <Divider />
        <ListItem
          id="main-help--license"
          primaryText={t('license.title')}
          leftIcon={<FontIcon>vpn_key</FontIcon>}
          component={Link}
          to={`${params.fqon}/license`}
        />
        <ListItem
          id="main-help--documentation"
          primaryText={<a className="gf-no-link" href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">{t('documentation.title')}</a>}
          leftIcon={<FontIcon>library_books</FontIcon>}
        />
      </MenuButton>
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
      <div className="flex-row center-center logo-container">
        <div className="flex-row center-center flex-12">
          <div className={logoClass}><GestaltIcon /></div>
        </div>
      </div>
    );
  }

  renderMain() {
    return (
      <main>
        <ThemeProvider theme={lightTheme}>
          <NavigationDrawer
            drawerTitle={<OrgNavMenu {...this.props} />}
            toolbarTitle={this.renderAppLogo()}
            autoclose
            navItems={this.renderNavItems()}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            toolbarActions={this.renderActionsMenu()}
            onVisibilityToggle={visible => this.handleVisibleState(visible)}
          >
            <LoginModal />
            <ModalRoot />
            {this.props.children}
          </NavigationDrawer>
        </ThemeProvider>
      </main>
    );
  }

  render() {
    return this.props.selfFetching ? this.renderProgress() : this.renderMain();
  }
}

function mapStateToProps(state) {
  const { app, browser } = state;

  return {
    self: app.self.self,
    selfFetching: app.self.pending,
    currentOrgContext: app.currentOrgContext.organization,
    activityIndicator: app.activityIndicator.activity,
    browser,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, licenseActions, loginActions))(translate()(App));
