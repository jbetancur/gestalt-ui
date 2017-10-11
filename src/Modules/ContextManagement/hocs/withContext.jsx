import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import contextActionCreators from '../actions';

/**
 * Higher-order component (HOC) to handle keeping our navigation context updated
 * It requires that you have wrapper this component with org, workspace and environment redux state
 */
export default function WithContext(BaseComponent) {
  class Context extends PureComponent {
    static propTypes = {
      match: PropTypes.object.isRequired,
      organizationSet: PropTypes.object,
      workspace: PropTypes.object,
      environment: PropTypes.object,
      currentOrgContext: PropTypes.object.isRequired,
      currentWorkspaceContext: PropTypes.object.isRequired,
      currentEnvironmentContext: PropTypes.object.isRequired,
      contextManagerActions: PropTypes.object.isRequired,
    };

    static defaultProps = {
      organizationSet: {},
      workspace: {},
      environment: {},
    };

    componentWillMount() {
      const {
        match,
        currentOrgContext,
        currentWorkspaceContext,
        currentEnvironmentContext,
        contextManagerActions,
      } = this.props;

      // These methods are to mainly to appease browser refresh or copy paste URL nav where we lose the hierarchy context

      // match of the params exist, but only make a GET from meta if the context is missing
      if (match.params.fqon && !currentOrgContext.id) {
        contextManagerActions.setCurrentOrgContextfromState(match.params.fqon);
      }

      // do the same for workspaces
      if ((match.params.fqon && match.params.workspaceId) && !currentWorkspaceContext.id) {
        contextManagerActions.setCurrentWorkspaceContextfromState(match.params.fqon, match.params.workspaceId);
      }

      // do the same for environments
      if ((match.params.fqon && match.params.workspaceId && match.params.environmentId) && !currentEnvironmentContext.id) {
        contextManagerActions.setCurrentEnvironmentContextfromState(match.params.fqon, match.params.environmentId);
      }
    }

    componentWillReceiveProps(nextProps) {
      // keep the org context synced if it is changed
      if (nextProps.organizationSet.id && nextProps.organizationSet.id !== this.props.organizationSet.id) {
        this.props.contextManagerActions.setCurrentOrgContext(nextProps.organizationSet);
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    const { contextManager } = state;

    return {
      currentOrgContext: contextManager.currentOrgContext.organization,
      currentWorkspaceContext: contextManager.currentWorkspaceContext.workspace,
      currentEnvironmentContext: contextManager.currentEnvironmentContext.environment,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      contextManagerActions: bindActionCreators(contextActionCreators, dispatch),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(withRouter(Context));
}
