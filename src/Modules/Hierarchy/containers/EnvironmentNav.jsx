import React from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem } from 'components/Navigation';
import { LambdaIcon, ContainerIcon } from 'components/Icons';

const renderNavItems = props => (
  [
    <NavItem
      key="environment--containers"
      icon={<ContainerIcon />}
      title="Containers"
      to={`${props.match.url}/containers`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--lambdas"
      icon={<LambdaIcon />}
      title="Lambdas"
      to={`${props.match.url}/lambdas`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--apis"
      icon="device_hub"
      title="APIs"
      to={`${props.match.url}/apis`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--policies"
      icon="verified_user"
      title="Policies"
      to={`${props.match.url}/policies`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--providers"
      icon="settings_applications"
      title="Providers"
      to={`${props.match.url}/providers`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--secrets"
      icon="lock"
      title="Secrets"
      to={`${props.match.url}/secrets`}
      activeClassName="active-link"
    />,
  ]
);

const EnvironmentNav = props => <Navbar vertical items={renderNavItems(props)} />;

export default withRouter(EnvironmentNav);
