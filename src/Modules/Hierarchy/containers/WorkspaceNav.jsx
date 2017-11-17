import React from 'react';
import { withRouter } from 'react-router-dom';
import Navbar from 'components/Navbar';
import ListItemStacked from 'components/ListItemStacked';

const renderNavItems = props => (
  [
    <ListItemStacked
      key="workspace--environments"
      title="Environments"
      icon="folder"
      to={`${props.match.url}/environments`}
      activeClassName="active-link"
    />,
    <ListItemStacked
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
