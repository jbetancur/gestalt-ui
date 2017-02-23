import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
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
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
  };

  render() {
    const {
      currentOrgContext,
      currentWorkspaceContext,
      currentEnvironmentContext,
    } = this.props;

    return (
      <span>
        <EnhancedLink
          to={`${currentOrgContext.properties.fqon}/organizations`}
        >
          {currentOrgContext.description || currentOrgContext.name}
        </EnhancedLink>

        {currentWorkspaceContext.id ? ' / ' : null}

        {currentWorkspaceContext.id ?
          <EnhancedLink
            to={`${currentOrgContext.properties.fqon}/workspaces/${currentWorkspaceContext.id}`}
          >
            {currentWorkspaceContext.description || currentWorkspaceContext.name}
          </EnhancedLink> : null}

        {currentEnvironmentContext.id ? ' / ' : null}

        {currentEnvironmentContext.id ?
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

export default connect(mapStateToProps)(Breadcrumbs);
