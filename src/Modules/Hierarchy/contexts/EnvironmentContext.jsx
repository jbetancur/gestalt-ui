import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource, withEnvironment, withWorkspace } from 'Modules/MetaResource';
import Div from 'components/Div';
import EnvironmentRoutes from '../routes/EnvironmentRoutes';
import EnvironmentNav from '../containers/EnvironmentNav';
import EnvironmentHeader from '../containers/EnvironmentHeader';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    workspaceActions: PropTypes.object.isRequired,
    environmentActions: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    unloadProviders: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      match,
      environmentActions,
      organizationSet,
      workspace,
      fetchOrgSet,
      workspaceActions,
    } = this.props;

    environmentActions.fetchEnvironment({ fqon: match.params.fqon, id: match.params.environmentId });

    // Keep org context synced in case of refresh
    if (match.params.fqon && !organizationSet.id) {
      fetchOrgSet(match.params.fqon);
    }

    // do the same for workspaces
    if ((match.params.fqon && match.params.workspaceId) && !workspace.id) {
      workspaceActions.fetchWorkspace({ fqon: match.params.fqon, id: match.params.workspaceId });
    }
  }

  componentWillUnmount() {
    // only clear state when the Environment Context changes - this acts as a cache
    const { unloadProviders, environmentActions } = this.props;

    unloadProviders();
    environmentActions.unloadEnvironment();
  }

  render() {
    const { environment } = this.props;

    return (
      <Div>
        <EnvironmentNav />
        <Div paddingLeft="5em" paddingBottom="56px">
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
  withEnvironment(),
  withWorkspace(),
)(EnvironmentContext);
