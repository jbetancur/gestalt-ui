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
import { UI_VERSION } from '../../../constants';
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
    // browser: PropTypes.object.isRequired
  };

  static defaultProps = {
    children: {}
  }

  constructor(props) {
    super(props);

    this.state = { drawerVisible: false };
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
    if (this.props.params.fqon) {
      return this.props.params.fqon;
    }

    if (this.baseFQON) {
      return this.baseFQON.substring(this.baseFQON.lastIndexOf('.') + 1);
    }

    return this.props.self.properties.gestalt_home;
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
        primaryText: this.selectedFQONName() || '',
        component: Link,
        to: `/${this.selectedFQONName()}/organizations`,
        leftIcon: this.state.drawerVisible ? <FontIcon>domain</FontIcon> : <TooltipFontIcon tooltipPosition="right" tooltipLabel={this.selectedFQONName()}>domain</TooltipFontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'workspaces',
        primaryText: 'Workspaces',
        component: Link,
        to: `/${this.selectedFQONName()}/workspaces`,
        leftIcon: <FontIcon>work</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'providers',
        primaryText: 'Providers',
        component: Link,
        to: `/${this.selectedFQONName()}/providers`,
        leftIcon: <FontIcon>cloud_queue</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'entitlements',
        primaryText: 'Entitlements',
        component: Link,
        to: `/${this.selectedFQONName()}/entitlements`,
        leftIcon: <FontIcon>security</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'users',
        primaryText: 'Users',
        component: Link,
        to: `/${this.selectedFQONName()}/users`,
        leftIcon: <FontIcon>person</FontIcon>,
        activeStyle: { backgroundColor: 'lightgrey' }
      },
      {
        key: 'groups',
        primaryText: 'Groups',
        component: Link,
        to: `/${this.selectedFQONName()}/groups`,
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
    browser
  };
}

export default connect(mapStateToProps, actions)(App);
