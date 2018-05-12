import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Navbar } from 'components/Navigation';
import { ProviderIcon, EnvironmentIcon } from 'components/Icons';

const WorkspaceNav = ({ match }) => {
  const navItems = [
    {
      key: 'workspace--environments',
      title: 'Environments',
      icon: <EnvironmentIcon size={28} />,
      to: `${match.url}/environments`,
    },
    {
      key: 'workspace--providers',
      title: 'Providers',
      icon: <ProviderIcon size={28} />,
      to: `${match.url}/providers`,
    },
  ];

  return (
    <Navbar vertical items={navItems} />
  );
};

WorkspaceNav.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(WorkspaceNav);
