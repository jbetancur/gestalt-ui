import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem } from 'components/Navigation';
import { LambdaIcon, ContainerIcon, ProviderIcon, APIIcon, PolicyIcon, SecretIcon, StreamIcon, DataFeedIcon } from 'components/Icons';
import withApp from 'App/withApp';

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
      icon={<APIIcon />}
      title="APIs"
      to={`${props.match.url}/apis`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--policies"
      icon={<PolicyIcon />}
      title="Policies"
      to={`${props.match.url}/policies`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--providers"
      icon={<ProviderIcon />}
      title="Providers"
      to={`${props.match.url}/providers`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--secrets"
      icon={<SecretIcon />}
      title="Secrets"
      to={`${props.match.url}/secrets`}
      activeClassName="active-link"
    />,
    <NavItem
      key="environment--streams"
      icon={<StreamIcon />}
      title="Streams"
      to={`${props.match.url}/streamspecs`}
      activeClassName="active-link"
      isVisible={props.appState.enableExperimental}
    />,
    <NavItem
      key="environment--datafeeds"
      icon={<DataFeedIcon />}
      title="Data"
      to={`${props.match.url}/datafeeds`}
      activeClassName="active-link"
      isVisible={props.appState.enableExperimental}
    />,
  ]
);

const EnvironmentNav = props => <Navbar vertical items={renderNavItems(props)} />;

export default compose(
  withRouter,
  withApp,
)(EnvironmentNav);
