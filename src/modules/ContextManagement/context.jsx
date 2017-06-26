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
      organization: PropTypes.object.isRequired,
      workspace: PropTypes.object.isRequired,
      environment: PropTypes.object.isRequired,
      currentOrgContext: PropTypes.object.isRequired,
      currentWorkspaceContext: PropTypes.object.isRequired,
      currentEnvironmentContext: PropTypes.object.isRequired,
      setCurrentOrgContextfromState: PropTypes.func.isRequired,
      setCurrentWorkspaceContextfromState: PropTypes.func.isRequired,
      setCurrentEnvironmentContextfromState: PropTypes.func.isRequired,
      setCurrentOrgContext: PropTypes.func.isRequired,
      setCurrentWorkspaceContext: PropTypes.func.isRequired,
      setCurrentEnvironmentContext: PropTypes.func.isRequired,
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

      // These methods are to mainly to appease browser refresh or copy paste URL nav where we lose the hierarchy context

      // match of the params exist, but only make a GET from meta if the contexct is missing
      if (match.params.fqon && !currentOrgContext.id) {
        setCurrentOrgContextfromState(match.params.fqon);
      }

      // do the same for workspaces
      if ((match.params.fqon && match.params.workspaceId) && !currentWorkspaceContext.id) {
        setCurrentWorkspaceContextfromState(match.params.fqon, match.params.workspaceId);
      }

      // do the same for environments
      if ((match.params.fqon && match.params.workspaceId && match.params.environmentId) && !currentEnvironmentContext.id) {
        setCurrentEnvironmentContextfromState(match.params.fqon, match.params.environmentId);
      }
    }

    componentWillReceiveProps(nextProps) {
      // TODO: This is a fallback for keeping contexts synced with store but we still need to move all the logic from Nav Cards to here
      if (nextProps.organization !== this.props.organization) {
        this.props.setCurrentOrgContext(nextProps.organization);
      }

      if (nextProps.workspace !== this.props.workspace) {
        this.props.setCurrentWorkspaceContext(nextProps.workspace);
      }

      if (nextProps.environment !== this.props.environment) {
        this.props.setCurrentEnvironmentContext(nextProps.environment);
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    const { metaResource } = state;

    return {
      organization: state.metaResource.organizationSet.organization,
      workspace: state.metaResource.workspace.workspace,
      environment: state.metaResource.environment.environment,
      currentOrgContext: metaResource.currentOrgContext.organization,
      currentWorkspaceContext: metaResource.currentWorkspaceContext.workspace,
      currentEnvironmentContext: metaResource.currentEnvironmentContext.environment,
    };
  }

  return connect(mapStateToProps, Object.assign({}, null))((Context));
}

