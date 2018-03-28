import React from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem } from 'components/Navigation';
import { ProviderIcon, EnvironmentIcon } from 'components/Icons';

const renderNavItems = props => (
  [
    <NavItem
      key="workspace--environments"
      title="Environments"
      icon={<EnvironmentIcon />}
      to={`${props.match.url}/environments`}
      activeClassName="active-link"
    />,
    <NavItem
      key="workspace--providers"
      title="Providers"
      icon={<ProviderIcon />}
      to={`${props.match.url}/providers`}
      activeClassName="active-link"
    />,
  ]
);

const WorkspaceNav = props => <Navbar vertical items={renderNavItems(props)} />;

export default withRouter(WorkspaceNav);
