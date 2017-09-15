import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'components/Navbar';
import ListItemStacked from 'components/ListItemStacked';
import { LambdaIcon } from 'components/Icons';

const renderNavItems = (navigation, handleNavigation) => (
  [
    <ListItemStacked
      key="environment--containers"
      icon="memory"
      title="Containers"
      onClick={() => handleNavigation('environment', 'containers', 0)}
      className={navigation.index === 0 && 'active-link'}
    />,
    <ListItemStacked
      key="environment--lambdas"
      icon={<LambdaIcon />}
      title="Lambdas"
      onClick={() => handleNavigation('environment', 'lambdas', 1)}
      className={navigation.index === 1 && 'active-link'}
    />,
    <ListItemStacked
      key="environment--apis"
      icon="device_hub"
      title="APIs"
      onClick={() => handleNavigation('environment', 'apis', 2)}
      className={navigation.index === 2 && 'active-link'}
    />,
    <ListItemStacked
      key="environment--policies"
      icon="verified_user"
      title="Policies"
      onClick={() => handleNavigation('environment', 'policies', 3)}
      className={navigation.index === 3 && 'active-link'}
    />,
    <ListItemStacked
      key="environment--providers"
      icon="settings_applications"
      title="Providers"
      onClick={() => handleNavigation('environment', 'providers', 4)}
      className={navigation.index === 4 && 'active-link'}
    />,
  ]
);

const EnvironmentNav = (props) => {
  const { navigation, handleNavigation } = props;

  return <Navbar vertical items={renderNavItems(navigation, handleNavigation)} />;
};

EnvironmentNav.propTypes = {
  navigation: PropTypes.object.isRequired,
  handleNavigation: PropTypes.func.isRequired,
};

export default EnvironmentNav;
