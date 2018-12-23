import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { OrganizationIcon, WorkspaceIcon, EnvironmentIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import { DotActivity } from 'components/ProgressIndicators';
import { media } from 'util/helpers/media';
import BreadCrumbDropdown from './BreadCrumbDropdown';
import withContext from '../hocs/withContext';
import {
  getSortedContextOrganizations,
  getSortedContextWorkspaces,
  getSortedContextEnvironments,
} from '../selectors';
import withSelf from '../../../App/hocs/withSelf';

const EnhancedLink = styled(({ isActive, ...rest }) => <Link {...rest} />)`
  color: ${props => props.theme.colors.fontCaption};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  height: 32px;
  font-weight: 600;

  &:hover {
    color: ${props => props.theme.colors.active};
  }

  ${props => props.isActive && css`
    color: ${props.theme.colors.active};

    i * {
      color: ${props.theme.colors.active};
    }

    svg * {
      fill: ${props.theme.colors.active};
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

  ${() => media.xs`
    display: none;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 20px;
`;

class Breadcrumbs extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    sortedOrganizations: PropTypes.array.isRequired,
    sortedWorkspaces: PropTypes.array.isRequired,
    sortedEnvironments: PropTypes.array.isRequired,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    isActive: false,
  }

  checkIfShouldNav(e, route) {
    const { history } = this.props;

    // Prevents Link from opening dropdown menu
    e.stopPropagation();

    if (history.location.pathname === route) {
      e.preventDefault();
    }
  }

  generateOrgItems() {
    const { hierarchyContext, sortedOrganizations } = this.props;
    const { context: { organization } } = hierarchyContext;

    return sortedOrganizations
      .filter(org => org.id !== organization.id)
      .map(org => ({
        id: org.id,
        name: org.description || org.name,
        secondaryName: org.name,
        component: Link,
        to: `/${org.properties.fqon}/hierarchy`,
      }));
  }

  // Fixes ghost environment listing when switching workspace fron an environment context
  handleWorkspaceNav(workspace) {
    const { history, hierarchyContextActions } = this.props;
    const workspaceRoute = `/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/environments`;

    if (history.location.pathname !== workspaceRoute) {
      hierarchyContextActions.unloadContext({ context: 'switch-context-from-environment' });
      history.replace(`/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/environments`);
    }
  }

  generateWorkspaceItems() {
    const { hierarchyContext, sortedWorkspaces } = this.props;
    const { context: { workspace } } = hierarchyContext;

    return sortedWorkspaces
      .filter(wkspc => wkspc.id !== workspace.id)
      .map(wkspc => ({
        id: wkspc.id,
        name: wkspc.description || wkspc.name,
        secondaryName: wkspc.name,
        onClick: () => this.handleWorkspaceNav(wkspc),
      }));
  }

  generateEnvironmentItems() {
    const { hierarchyContext, sortedEnvironments } = this.props;
    const { context: { environment } } = hierarchyContext;

    return sortedEnvironments
      .filter(env => env.id !== environment.id)
      .map(env => ({
        id: env.id,
        name: env.description || env.name,
        secondaryName: env.name,
        component: Link,
        to: `/${env.org.properties.fqon}/hierarchy/${env.properties.workspace.id}/environment/${env.id}`,
      }));
  }

  render() {
    const {
      isActive,
      hierarchyContextActions,
      hierarchyContext,
    } = this.props;

    const {
      contextPending,
      allOrganizationsPending,
      context: {
        contextMeta,
        organization,
        workspace,
        environment,
      }
    } = hierarchyContext;

    const parentOrgRoute = `/${organization.org.properties.fqon}/hierarchy`;
    const orgsRoute = `/${organization.properties.fqon}/hierarchy`;
    const workspaceRoute = `/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/environments`;
    const environmentRoute = `/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/environment/${environment.id}`;
    const orgNavDisabled = organization.properties.fqon === 'root';
    const orgName = organization.description || organization.name;
    const workspaceName = workspace.description || workspace.name;
    const environmentName = environment.description || environment.name;
    // we use the url match.params so the transition is faster - otherwise we have a lag ahile the state is fetched
    const isWorkspaceCtx = workspace.id && contextMeta.workspaceId;
    const isEnvironmentCtx = environment.id && contextMeta.environmentId;
    const isOrgContext = !workspace.id && !environment.id && !contextMeta.workspaceId && !contextMeta.environmentId;

    return (
      <Wrapper isActive={isActive}>
        {organization.properties.fqon &&
          <NavArrow
            icon
            disabled={contextPending || orgNavDisabled}
            component={Link}
            to={parentOrgRoute}
            tooltipLabel="Up one org level"
            tooltipPosition="right"
            inkDisabled
          >
            arrow_upward
          </NavArrow>}

        {!organization.id && <DotActivity id="breadcrumbs-loading" size={1} />}
        {organization.id &&
        <BreadCrumbDropdown
          id="organizations-dropdown"
          menuItems={this.generateOrgItems()}
          icon={<OrganizationIcon size={18} primary={!!isOrgContext} />}
          // createLabel="Create Organization"
          // createRoute={{ pathname: `/${organization.properties.fqon}/createOrganization`, state: { modal: true } }}
          title="Organizations"
          onOpen={hierarchyContextActions.fetchAllOrgs}
          pending={allOrganizationsPending}
          label={(
            <EnhancedLink
              onClick={e => this.checkIfShouldNav(e, orgsRoute)}
              to={orgsRoute}
              isActive={isOrgContext}
              disabled={contextPending}
            >
              {orgName}
            </EnhancedLink>
          )}
        />}

        {isWorkspaceCtx && organization.id &&
        <BreadCrumbDropdown
          id="workspaces-dropdown"
          menuItems={this.generateWorkspaceItems()}
          icon={<WorkspaceIcon size={18} primary={!!(isWorkspaceCtx && !isEnvironmentCtx)} />}
          createLabel="Create Workspace"
          createRoute={{ pathname: `/${organization.properties.fqon}/createWorkspace`, state: { modal: true } }}
          title={`Workspaces in ${orgName}`}
          label={(
            <EnhancedLink
              onClick={e => this.checkIfShouldNav(e, workspaceRoute)}
              to={workspaceRoute}
              isActive={isWorkspaceCtx && !isEnvironmentCtx}
              disabled={contextPending}
            >
              {workspaceName}
            </EnhancedLink>
          )}
        />}

        {isEnvironmentCtx && isWorkspaceCtx && organization.id &&
        <BreadCrumbDropdown
          id="environments-dropdown"
          menuItems={this.generateEnvironmentItems()}
          icon={<EnvironmentIcon size={18} primary={!!isEnvironmentCtx} />}
          createLabel="Create Environment"
          createRoute={{ pathname: `/${environment.org.properties.fqon}/hierarchy/${environment.properties.workspace.id}/createEnvironment`, state: { modal: true } }}
          title={`Environments in ${workspaceName}`}
          label={(
            <EnhancedLink
              onClick={e => this.checkIfShouldNav(e, environmentRoute)}
              to={environmentRoute}
              isActive={isEnvironmentCtx}
              disabled={contextPending}
            >
              {environmentName}
            </EnhancedLink>
          )}
        />}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  sortedOrganizations: getSortedContextOrganizations(state),
  sortedWorkspaces: getSortedContextWorkspaces(state),
  sortedEnvironments: getSortedContextEnvironments(state),
});

export default compose(
  withContext(),
  withSelf,
  withRouter,
  connect(mapStateToProps),
)(Breadcrumbs);
