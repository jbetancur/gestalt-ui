import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Navbar } from 'components/Navigation';
import { LambdaIcon, ContainerIcon, ProviderIcon, APIIcon, PolicyIcon, SecretIcon, StreamIcon, DataFeedIcon } from 'components/Icons';
import withApp from 'App/withApp';

const EnvironmentNav = ({ match, appState }) => {
  const navItems = [
    {
      key: 'environment--containers',
      icon: <ContainerIcon size={28} />,
      title: 'Containers',
      to: `${match.url}/containers`,
    },
    {
      key: 'environment--lambdas',
      icon: <LambdaIcon size={28} />,
      title: 'Lambdas',
      to: `${match.url}/lambdas`,
    },
    {
      key: 'environment--apis',
      icon: <APIIcon size={28} />,
      title: 'APIs',
      to: `${match.url}/apis`,
    },
    {
      key: 'environment--policies',
      icon: <PolicyIcon size={28} />,
      title: 'Policies',
      to: `${match.url}/policies`,
    },
    {
      key: 'environment--providers',
      icon: <ProviderIcon size={28} />,
      title: 'Providers',
      to: `${match.url}/providers`,
    },
    {
      key: 'environment--secrets',
      icon: <SecretIcon size={28} />,
      title: 'Secrets',
      to: `${match.url}/secrets`,
    },
    {
      key: 'environment--streams',
      icon: <StreamIcon size={28} />,
      title: 'Streams',
      to: `${match.url}/streamspecs`,
      isVisible: appState.enableExperimental,
    },
    {
      key: 'environment--datafeeds',
      icon: <DataFeedIcon size={28} />,
      title: 'Data',
      to: `${match.url}/datafeeds`,
      isVisible: appState.enableExperimental,
    },
  ];

  return (
    <Navbar vertical items={navItems} />
  );
};

EnvironmentNav.propTypes = {

  appState: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withApp,
)(EnvironmentNav);
