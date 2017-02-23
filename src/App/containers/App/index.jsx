import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import CircularActivity from 'components/CircularActivity';
import OrgNavMenu from 'modules/OrgNavMenu';
import ModalRoot from 'modules/ModalRoot';
import LoginModal from 'modules/Login/components/LoginModal';
import TooltipFontIcon from 'components/TooltipFontIcon';
import ErrorNotifications from 'modules/ErrorNotifications';
import GestaltIcon from 'components/GestaltIcon';
import GestaltIconText from 'components/GestaltIconText';
import { UI_VERSION, DOCUMENTATION_URL } from '../../../constants';
import * as actions from '../../actions';

const EnhancedLogoDiv = styled.div`
  text-align: center;
  width: 12em;

  svg {
    width: 4em;
    height: 4em;
  }
`;

const EnhancedUIVersionDiv = styled.div`
  color: black;
  padding-top: 1em;
  /* padding: 1.5em; */
  font-size: .9em;
`;

class App extends Component {
  static propTypes = {
    fetchSelf: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.object,
    selfFetching: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    setCurrentOrgContextfromState: PropTypes.func.isRequired,
    setCurrentWorkspaceContextfromState: PropTypes.func.isRequired,
    setCurrentEnvironmentContextfromState: PropTypes.func.isRequired,
    // browser: PropTypes.object.isRequired
  };

  static defaultProps = {
    children: {},
  }

  constructor(props) {
    super(props);

    this.state = { drawerVisible: false };
  }

  componentWillMount() {
    // sets our current logged in users home org
    this.props.fetchSelf();
    // we have to make an additional call here to set the currentOrgState
    // This is mainly to appease browser refresh where we lose currentOrg state
    if (this.props.params.fqon) {
      this.props.setCurrentOrgContextfromState(this.props.params.fqon);
    }

    // do the same for workspaces
    if (this.props.params.fqon && this.props.params.workspaceId) {
      this.props.setCurrentWorkspaceContextfromState(this.props.params.fqon, this.props.params.workspaceId);
    }

    // do the same for environments
    if (this.props.params.fqon && this.props.params.workspaceId && this.props.params.environmentId) {
      this.props.setCurrentEnvironmentContextfromState(this.props.params.fqon, this.props.params.environmentId);
    }
  }

  componentWillReceiveProps(nextProps) {
    // where there is no fqon in the url set the current org context
    if (nextProps.self !== this.props.self && !this.props.params.fqon) {
      this.props.setCurrentOrgContextfromState(nextProps.self.properties.gestalt_home.properties.fqon);
    }
  }

  getCurrentOrgContext() {
    const { currentOrgContext, self } = this.props;
    // if we don't have an org context then get it from the user self
    // in the future we can map this to a favorite org
    return currentOrgContext.id ? currentOrgContext : self.properties.gestalt_home;
  }

  logout() {
    this.props.logout();
  }

  handleVisibleState(visible) {
    this.setState({ drawerVisible: visible });
  }

  renderNavItems() {
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
        primaryText: 'Workspaces',
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/workspaces`,
        leftIcon: <FontIcon>work</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'providers',
        primaryText: 'Providers',
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/providers`,
        leftIcon: <FontIcon>cloud_queue</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'entitlements',
        primaryText: 'Entitlements',
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/entitlements`,
        leftIcon: <FontIcon>security</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'users',
        primaryText: 'Users',
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/users`,
        leftIcon: <FontIcon>person</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'groups',
        primaryText: 'Groups',
        component: Link,
        to: `/${this.getCurrentOrgContext().properties.fqon}/groups`,
        leftIcon: <FontIcon>group</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      }
    ];
  }

  renderActionsMenu() {
    const { self } = this.props;

    return [
      <MenuButton
        id="main-menu"
        icon
        buttonChildren="person"
      >
        <ListItem
          id="main-menu--profile"
          primaryText={self.name || ''}
          leftIcon={<FontIcon>person</FontIcon>}
        />
        <Divider />
        <ListItem
          id="main-menu--logout"
          primaryText="logout"
          leftIcon={<FontIcon>input</FontIcon>}
          onClick={e => this.logout(e)}
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
          primaryText="License"
          leftIcon={<FontIcon>vpn_key</FontIcon>}
          component={Link}
          to={`${this.props.params.fqon}/license`}
        />
        <ListItem
          id="main-help--documentation"
          primaryText={<a className="gf-no-link" href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">Documentation</a>}
          leftIcon={<FontIcon>library_books</FontIcon>}
        />
      </MenuButton>
    ];
  }

  renderProgress() {
    return <CircularActivity id="app-main-progess" />;
  }

  renderAppLogo() {
    return (
      <div className="flex-row center-center logo-container">
        <div className="flex-row center-center flex-12">
          <div className="logo"><GestaltIcon /></div>
        </div>
      </div>
    );
  }

  renderMain() {
    return (
      <main>
        <LoginModal />
        <ModalRoot />
        <NavigationDrawer
          contentClassName="md-grid--no-spacing"
          navItems={this.renderNavItems()}
          mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
          autoclose
          tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
          desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
          toolbarActions={this.renderActionsMenu()}
          drawerTitle={<OrgNavMenu {...this.props} />}
          toolbarTitle={this.renderAppLogo()}
          onVisibilityToggle={visible => this.handleVisibleState(visible)}
        >
          {React.Children.toArray(this.props.children)}
          <ErrorNotifications />
        </NavigationDrawer>
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
    browser,
  };
}

export default connect(mapStateToProps, actions)(App);
