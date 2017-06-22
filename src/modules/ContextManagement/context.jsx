import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Higher-order component (HOC) to handle keeping our navication context updated
 */
export default function ContextWrapper(BaseComponent) {
  class Context extends PureComponent {
    static propTypes = {
      match: PropTypes.object.isRequired,
      currentOrgContext: PropTypes.func.isRequired,
      currentWorkspaceContext: PropTypes.func.isRequired,
      currentEnvironmentContext: PropTypes.func.isRequired,
      setCurrentOrgContextfromState: PropTypes.func.isRequired,
      setCurrentWorkspaceContextfromState: PropTypes.func.isRequired,
      setCurrentEnvironmentContextfromState: PropTypes.func.isRequired,
    };

    componentWillMount() {
      const {
        match,
        currentOrgContext,
        currentWorkspaceContext,
        currentEnvironmentContext,
        setCurrentOrgContextfromState,
        setCurrentWorkspaceContextfromState,
        setCurrentEnvironmentContextfromState,
      } = this.props;

      // These methiods are to mainly to appease browser refresh or copy paste URL nav where we lose the hierarchy context

      // match of the params exist, but only make a GET from meta if the contexct is missing
      if (match.params.fqon && !currentOrgContext.id) {
        setCurrentOrgContextfromState(match.params.fqon);
      }

      // do the same for workspaces
      if (match.params.fqon && match.params.workspaceId && !currentWorkspaceContext.id) {
        setCurrentWorkspaceContextfromState(match.params.fqon, match.params.workspaceId);
      }

      // do the same for environments
      if (match.params.fqon && match.params.workspaceId && match.params.environmentId && !currentEnvironmentContext.id) {
        setCurrentEnvironmentContextfromState(match.params.fqon, match.params.environmentId);
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    const { metaResource } = state;

    return {
      currentOrgContext: metaResource.currentOrgContext.organization,
      currentWorkspaceContext: metaResource.currentWorkspaceContext.workspace,
      currentEnvironmentContext: metaResource.currentEnvironmentContext.environment,
    };
  }

  return connect(mapStateToProps, Object.assign({}, null))((Context));
}

