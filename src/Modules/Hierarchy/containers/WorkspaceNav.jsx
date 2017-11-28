import React from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem } from 'components/Navigation';

const renderNavItems = props => (
  [
    <NavItem
      key="workspace--environments"
      title="Environments"
      icon="folder"
      to={`${props.match.url}/environments`}
      activeClassName="active-link"
    />,
    <NavItem
      key="workspace--providers"
      title="Providers"
      icon="settings_applications"
      to={`${props.match.url}/providers`}
      activeClassName="active-link"
    />,
  ]
);

const WorkspaceNav = props => <Navbar vertical items={renderNavItems(props)} />;

export default withRouter(WorkspaceNav);
