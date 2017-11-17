import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import EnvironmentRoutes from '../routes/EnvironmentRoutes';
import EnvironmentNav from '../containers/EnvironmentNav';
import EnvironmentHeader from '../containers/EnvironmentHeader';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    organizationSet: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    unloadEnvironment: PropTypes.func.isRequired,
    unloadContainers: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
    unloadAPIs: PropTypes.func.isRequired,
    unloadPolicies: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
    unloadSecrets: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      match,
      fetchEnvironment,
      fetchContextActions,
      organizationSet,
      workspace,
      fetchOrgSet,
      fetchWorkspace
    } = this.props;

    fetchEnvironment(match.params.fqon, match.params.environmentId);
    fetchContextActions(match.params.fqon, match.params.environmentId, 'environments', { filter: ['environment.list', 'environment.detail'] });

    // Keep org context synced in case of refresh
    if (match.params.fqon && !organizationSet.id) {
      fetchOrgSet(match.params.fqon);
    }

    // do the same for workspaces
    if ((match.params.fqon && match.params.workspaceId) && !workspace.id) {
      fetchWorkspace(match.params.fqon, match.params.workspaceId);
    }
  }

  componentWillUnmount() {
    // only clear state when the Environment Context changes - this acts as a cache
    const { unloadEnvironment, unloadContainers, unloadLambdas, unloadAPIs, unloadPolicies, unloadProviders, unloadSecrets } = this.props;

    unloadEnvironment();
    unloadContainers();
    unloadLambdas();
    unloadAPIs();
    unloadPolicies();
    unloadProviders();
    unloadSecrets();
  }

  render() {
    const { environment } = this.props;

    return (
      <Div>
        <EnvironmentNav />
        <Div paddingLeft="5em">
          <EnvironmentHeader
            model={environment}
            {...this.props}
          />
          <EnvironmentRoutes />
        </Div>
      </Div>
    );
  }
}

export default compose(
  withMetaResource,
)(EnvironmentContext);
