import React, { Component, PropTypes } from 'react';
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
  }

  &:active {
      text-decoration: underline;
  }
`;

class Breadcrumbs extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
    seperator: PropTypes.string,
  };

  static defaultProps = {
    seperator: '/'
  }

  render() {
    const {
      currentOrgContext,
      currentWorkspaceContext,
      currentEnvironmentContext,
      params,
      seperator,
    } = this.props;

    return (
      <span>
        <EnhancedLink
          to={`${currentOrgContext.properties.fqon}/organizations`}
        >
          {currentOrgContext.description || currentOrgContext.name}
        </EnhancedLink>

        {currentWorkspaceContext.id && params.workspaceId ? ` ${seperator} ` : null}

        {currentWorkspaceContext.id && params.workspaceId ?
          <EnhancedLink
            to={`${currentOrgContext.properties.fqon}/workspaces/${currentWorkspaceContext.id}`}
          >
            {currentWorkspaceContext.description || currentWorkspaceContext.name}
          </EnhancedLink> : null}

        {currentEnvironmentContext.id && params.environmentId ? ` ${seperator} ` : null}

        {currentEnvironmentContext.id && params.environmentId ?
          <EnhancedLink
            to={`${currentOrgContext.properties.fqon}/workspaces/${currentWorkspaceContext.id}/environments/${currentEnvironmentContext.id}`}
          >
            {currentEnvironmentContext.description || currentEnvironmentContext.name}
          </EnhancedLink> : null}
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentOrgContext: state.app.currentOrgContext.organization,
    currentWorkspaceContext: state.app.currentWorkspaceContext.workspace,
    currentEnvironmentContext: state.app.currentEnvironmentContext.environment,
  };
}

export default connect(mapStateToProps)(withRouter(Breadcrumbs));
