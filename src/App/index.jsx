import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import CircularActivity from 'components/CircularActivity';
import OrgNavMenu from 'modules/OrgNavMenu';
import ErrorNotifications from '../modules/ErrorNotifications';
import GestaltIcon from '../components/GestaltIcon';
import * as actions from './actions';

class App extends Component {
  static propTypes = {
    fetchSelf: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.object,
    selfFetching: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    // browser: PropTypes.object.isRequired
  };

  static defaultProps = {
    children: {}
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchSelf();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.fqon !== this.props.params.fqon) {
      this.baseFQON = nextProps.params.fqon;
    }
  }

  selectedFQONName() {
    if (this.baseFQON) {
      return this.baseFQON.substring(this.baseFQON.lastIndexOf('.') + 1);
    }

    return this.props.self.properties.gestalt_home;
  }

  logout() {
    this.props.logout();
  }

  renderNavItems() {
    const { self } = this.props;

    return [
      {
        key: 'organizations',
        primaryText: this.selectedFQONName() || '',
        component: Link,
        to: `/${this.baseFQON || self.properties.gestalt_home}/organizations`,
        leftIcon: <FontIcon>domain</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'workspaces',
        primaryText: 'Workspaces',
        component: Link,
        to: `/${this.baseFQON || self.properties.gestalt_home}/workspaces`,
        leftIcon: <FontIcon>work</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'providers',
        primaryText: 'Providers',
        component: Link,
        to: `/${this.baseFQON || self.properties.gestalt_home}/providers`,
        leftIcon: <FontIcon>cloud_queue</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'entitlements',
        primaryText: 'Entitlements',
        component: Link,
        to: `/${this.baseFQON || self.properties.gestalt_home}/entitlements`,
        leftIcon: <FontIcon>security</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'users',
        primaryText: 'Users',
        component: Link,
        to: `/${this.baseFQON || self.properties.gestalt_home}/users`,
        leftIcon: <FontIcon>person</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'groups',
        primaryText: 'Groups',
        component: Link,
        to: `/${this.baseFQON || self.properties.gestalt_home}/groups`,
        leftIcon: <FontIcon>group</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      }
    ];
  }

  renderActionsMenu() {
    const { self } = this.props;

    return (
      <div>
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
        </MenuButton>
      </div>
    );
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
  const { orgnavmenu, app, browser } = state;

  return {
    organizations: orgnavmenu.organizations.items.filter(val => val.name.includes(orgnavmenu.filter.filterText)),
    orgFetching: orgnavmenu.organizations.pending,
    self: app.self.self,
    selfFetching: app.self.pending,
    browser
  };
}

export default connect(mapStateToProps, actions)(App);
