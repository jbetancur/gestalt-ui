import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FontIcon from 'react-md/lib/FontIcons';

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

const Icon = styled(FontIcon)`
  font-size: 14px;
  padding-right: .3em;
`;

class Breadcrumbs extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
    seperator: PropTypes.string,
  };

  static defaultProps = {
    seperator: '/',
  }

  checkIfShouldNav(e, route) {
    // strip '/'to make compares reliable
    if ((this.props.location.pathname.split('/').join('') === route.split('/').join(''))) {
      e.preventDefault();
    }
  }

  render() {
    const {
      currentOrgContext,
      currentWorkspaceContext,
      currentEnvironmentContext,
      match,
      seperator,
    } = this.props;

    const orgsRoute = `/${currentOrgContext.properties.fqon}/hierarchy`;
    // const workspacesRoute = `/${currentOrgContext.properties.fqon}/hierarchy`;
    const workspaceRoute = `/${currentOrgContext.properties.fqon}/hierarchy/${currentWorkspaceContext.id}`;
    const environmentRoute = `/${currentOrgContext.properties.fqon}/hierarchy/${currentWorkspaceContext.id}/environments/${currentEnvironmentContext.id}`;

    return (
      <span>
        <EnhancedLink
          onClick={e => this.checkIfShouldNav(e, orgsRoute)}
          to={orgsRoute}
        >
          <span><Icon>domain</Icon>{currentOrgContext.description || currentOrgContext.name}</span>
        </EnhancedLink>

        {(currentWorkspaceContext.id && match.params.workspaceId) && ` ${seperator} `}

        {(currentWorkspaceContext.id && match.params.workspaceId) &&
          <EnhancedLink
            onClick={e => this.checkIfShouldNav(e, workspaceRoute)}
            to={workspaceRoute}
          >
            <span><Icon>work</Icon>{currentWorkspaceContext.description || currentWorkspaceContext.name}</span>
          </EnhancedLink>}

        {(currentEnvironmentContext.id && match.params.environmentId) && ` ${seperator} `}

        {(currentEnvironmentContext.id && match.params.environmentId) &&
          <EnhancedLink
            onClick={e => this.checkIfShouldNav(e, environmentRoute)}
            to={environmentRoute}
          >
            <span><Icon>folder</Icon>{currentEnvironmentContext.description || currentEnvironmentContext.name}</span>
          </EnhancedLink>}
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
