import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { withSelf, } from 'Modules/MetaResource';
import { Divider, ListItem } from 'react-md';
import { OrganizationIcon, WorkspaceIcon, EnvironmentIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import BreadCrumbDropdown from '../components/BreadCrumbDropdown';
import withContext from '../hocs/withContext';

const EnhancedLink = styled(({ isActive, ...rest }) => <Link {...rest} />)`
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  height: 32px;

  &:hover {
    color: ${props => props.theme.colors['$md-blue-400']};
    text-decoration: underline;
  }

  ${props => props.isActive && css`
    color: ${props.theme.colors['$md-blue-500']};

    i * {
      color: ${props.theme.colors['$md-blue-500']};
      fill: ${props.theme.colors['$md-blue-500']};
    }
  `};
`;

const NavArrow = styled(Button)`
  height: 32px;
  width: 32px;
  padding: 7px;

  i {
    font-size: 18px !important;
  }

  @media (min-width: 0) and (max-width: 659px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 20px;
  font-size: 20px;
`;

class Breadcrumbs extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    size: PropTypes.number,
    isActive: PropTypes.bool,
    pending: PropTypes.bool,
  };

  static defaultProps = {
    pending: false,
    size: 20,
    isActive: false,
  }

  checkIfShouldNav(e, route) {
    const { history } = this.props;

    if (history.location.pathname === route) {
      e.preventDefault();
    }
  }

  generateOrgItems() {
    const {
      context: {
        organization,
        organizations,
      }
    } = this.props;

    return [
      <ListItem
        id="breadcrumbs-menu--create"
        key="breadcrumbs-menu--create"
        primaryText="Create Organization..."
        component={Link}
        to={{ pathname: `/${organization.properties.fqon}/createOrganization`, state: { modal: true } }}
      />,
      <Divider key="breadcrumbs-menu-organization--divider" />,
      ...organizations.map(org => (
        <ListItem
          id={org.name}
          key={org.id}
          primaryText={org.description || org.name}
          secondaryText={org.name}
          inkDisabled
          component={Link}
          to={`/${org.properties.fqon}/hierarchy`}
        />)
      )
    ];
  }

  generateWorkspaceItems() {
    const {
      context: {
        workspaces,
        organization,
      },
    } = this.props;

    return [
      <ListItem
        id="breadcrumbs-menu--workspace-create"
        key="breadcrumbs-menu--workspace-create"
        primaryText="Create Workspace..."
        component={Link}
        to={{ pathname: `/${organization.properties.fqon}/createWorkspace`, state: { modal: true } }}
      />,
      <Divider key="breadcrumbs-menu-workspace--divider" />,
      ...workspaces.map(wkspc => (
        <ListItem
          id={wkspc.name}
          key={wkspc.id}
          primaryText={wkspc.description || wkspc.name}
          secondaryText={wkspc.name}
          inkDisabled
          component={Link}
          to={`/${wkspc.org.properties.fqon}/hierarchy/${wkspc.id}/environments`}
        />)
      )
    ];
  }

  generateEnvironmentItems() {
    const { context: {
      environment,
      environments,
    }
    } = this.props;

    return [
      <ListItem
        id="breadcrumbs-menu--environment-create"
        key="breadcrumbs-menu--environment-create"
        primaryText="Create Environment..."
        component={Link}
        to={{ pathname: `/${environment.org.properties.fqon}/hierarchy/${environment.properties.workspace.id}/createEnvironment`, state: { modal: true } }}
      />,
      <Divider key="breadcrumbs-menu-environment--divider" />,
      ...environments.map(env => (
        <ListItem
          id={env.name}
          key={env.id}
          primaryText={env.description || env.name}
          secondaryText={env.name}
          inkDisabled
          component={Link}
          to={`/${env.org.properties.fqon}/hierarchy/${env.properties.workspace.id}/environment/${env.id}`}
        />)
      )
    ];
  }

  render() {
    const {
      match,
      size,
      isActive,
      pending,
      context: {
        organization,
        workspace,
        environment,
      },
    } = this.props;

    const parentOrgRoute = `/${organization.org.properties.fqon}/hierarchy`;
    const orgsRoute = `/${organization.properties.fqon}/hierarchy`;
    const workspaceRoute = `/${organization.properties.fqon}/hierarchy/${workspace.id}/environments`;
    const environmentRoute = `${match.url}`;
    const orgName = organization.description || organization.name;
    const workspaceName = workspace.description || workspace.name;
    const environmentName = environment.description || environment.name;
    const isWorkspaceCtx = workspace.id;
    const isEnvironmentCtx = environment.id;
    const isOrgContext = !workspace.id && !environment.id;
    const orgNavDisabled = organization.properties.fqon === 'root';

    return (
      <Wrapper size={size} isActive={isActive}>
        {organization.properties.fqon &&
          <NavArrow
            icon
            disabled={pending || orgNavDisabled}
            component={Link}
            to={parentOrgRoute}
            tooltipLabel="Up one org level"
            tooltipPosition="right"
            inkDisabled
          >
            arrow_upward
          </NavArrow>}

        {orgName &&
        <BreadCrumbDropdown
          flat
          menuItems={this.generateOrgItems()}
          disabled={pending}
          icon={<OrganizationIcon size={size} primary={!!isOrgContext} />}
          label={(
            <EnhancedLink
              onClick={e => this.checkIfShouldNav(e, orgsRoute)}
              to={orgsRoute}
              isActive={isOrgContext}
            >
              {orgName}
            </EnhancedLink>
          )}
        />}

        {isWorkspaceCtx && orgName &&
        <BreadCrumbDropdown
          flat
          menuItems={this.generateWorkspaceItems()}
          disabled={pending}
          icon={<WorkspaceIcon size={size} primary={!!(isWorkspaceCtx && !isEnvironmentCtx)} />}
          label={(
            <EnhancedLink
              onClick={e => this.checkIfShouldNav(e, workspaceRoute)}
              to={workspaceRoute}
              isActive={isWorkspaceCtx && !isEnvironmentCtx}
            >
              {workspaceName}
            </EnhancedLink>
          )}
        />}

        {isEnvironmentCtx && isWorkspaceCtx && orgName &&
        <BreadCrumbDropdown
          flat
          menuItems={this.generateEnvironmentItems()}
          disabled={pending}
          icon={<EnvironmentIcon size={size} primary={!!isEnvironmentCtx} />}
          label={(
            <EnhancedLink
              onClick={e => this.checkIfShouldNav(e, environmentRoute)}
              to={environmentRoute}
              isActive={isEnvironmentCtx}
            >
              {environmentName}
            </EnhancedLink>
          )}
        />}
      </Wrapper>
    );
  }
}

export default compose(
  withContext(),
  withSelf,
  withRouter,
)(Breadcrumbs);
