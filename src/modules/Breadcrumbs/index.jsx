import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

const EnhancedLink = styled(Link)`
  color: inherit;

  &:link {
      text-decoration: none;
  }

  &:visited {
      text-decoration: none;
  }

  &:hover {
      text-decoration: none;
      color: black;
  }

  &:active {
      text-decoration: none;
  }
`;

class Breadcrumbs extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
    seperator: PropTypes.string,
  };

  static defaultProps = {
    seperator: '/'
  }

  allowNav(e, route) {
    if (this.props.router.location.pathname === route) {
      e.preventDefault();
    }
  }

  render() {
    const {
      currentOrgContext,
      currentWorkspaceContext,
      currentEnvironmentContext,
      params,
      seperator,
    } = this.props;

    const orgsRoute = `/${currentOrgContext.properties.fqon}/organizations`;
    const workspacesRoute = `/${currentOrgContext.properties.fqon}/workspaces`;
    const workspaceRoute = `/${currentOrgContext.properties.fqon}/workspaces/${currentWorkspaceContext.id}`;
    const environmentRoute = `/${currentOrgContext.properties.fqon}/workspaces/${currentWorkspaceContext.id}/environments/${currentEnvironmentContext.id}`;

    return (
      <span>
        <EnhancedLink
          onClick={e => this.allowNav(e, orgsRoute)}
          to={orgsRoute}
        >
          {currentOrgContext.description || currentOrgContext.name}
        </EnhancedLink>

        {currentWorkspaceContext.id && params.workspaceId ? ` ${seperator} ` : null}

        {currentWorkspaceContext.id && params.workspaceId ?
          <EnhancedLink
            onClick={e => this.allowNav(e, workspacesRoute)}
            to={workspacesRoute}
          >
            Workspaces
          </EnhancedLink> : null}

        {currentWorkspaceContext.id && params.workspaceId ? ` ${seperator} ` : null}

        {currentWorkspaceContext.id && params.workspaceId ?
          <EnhancedLink
            onClick={e => this.allowNav(e, workspaceRoute)}
            to={workspaceRoute}
          >
            {currentWorkspaceContext.description || currentWorkspaceContext.name}
          </EnhancedLink> : null}

        {currentEnvironmentContext.id && params.environmentId ? ` ${seperator} ` : null}

        {currentEnvironmentContext.id && params.environmentId ?
          <EnhancedLink
            onClick={e => this.allowNav(e, environmentRoute)}
            to={environmentRoute}
          >
            {currentEnvironmentContext.description || currentEnvironmentContext.name}
          </EnhancedLink> : null}
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentOrgContext: state.metaResource.currentOrgContext.organization,
    currentWorkspaceContext: state.metaResource.currentWorkspaceContext.workspace,
    currentEnvironmentContext: state.metaResource.currentEnvironmentContext.environment,
  };
}

export default connect(mapStateToProps)(withRouter(Breadcrumbs));
