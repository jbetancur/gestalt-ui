import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'components/Navbar';
import ListItemStacked from 'components/ListItemStacked';

const renderNavItems = (navigation, handleNavigation) => (
  [
    <ListItemStacked
      key="workspace--environments"
      title="Environments"
      icon="folder"
      onClick={() => handleNavigation('workspace', 'environments', 0)}
      className={navigation.index === 0 && 'active-link'}
    />,
    <ListItemStacked
      key="workspace--providers"
      title="Providers"
      icon="settings_applications"
      onClick={() => handleNavigation('workspace', 'providers', 1)}
      className={navigation.index === 1 && 'active-link'}
    />,
  ]
);

const WorkspaceNav = (props) => {
  const { navigation, handleNavigation } = props;

  return <Navbar vertical items={renderNavItems(navigation, handleNavigation)} />;
};

WorkspaceNav.propTypes = {
  navigation: PropTypes.object.isRequired,
  handleNavigation: PropTypes.func.isRequired,
};

export default WorkspaceNav;
