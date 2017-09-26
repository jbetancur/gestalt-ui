import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withMetaResource } from 'modules/MetaResource';

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
      setCurrentOrgContextfromState: PropTypes.func.isRequired,
      setCurrentWorkspaceContextfromState: PropTypes.func.isRequired,
      setCurrentEnvironmentContextfromState: PropTypes.func.isRequired,
      setCurrentOrgContext: PropTypes.func.isRequired,
      setCurrentWorkspaceContext: PropTypes.func.isRequired,
      setCurrentEnvironmentContext: PropTypes.func.isRequired,
      unloadContextActions: PropTypes.func.isRequired,
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
        setCurrentOrgContextfromState,
        setCurrentWorkspaceContextfromState,
        setCurrentEnvironmentContextfromState,
      } = this.props;

      // These methods are to mainly to appease browser refresh or copy paste URL nav where we lose the hierarchy context

      // match of the params exist, but only make a GET from meta if the context is missing
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
      // keep the org context synced if it is changed
      if (nextProps.organizationSet.id !== this.props.organizationSet.id) {
        // console.log('test', nextProps.organizationSet, this.props.organizationSet);
        this.props.setCurrentOrgContext(nextProps.organizationSet);
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  return withRouter(withMetaResource(Context));
}
