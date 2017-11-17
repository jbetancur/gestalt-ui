import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import WorkspaceRoutes from '../routes/WorkspaceRoutes';
import WorkspaceNav from '../containers/WorkspaceNav';
import WorkspaceHeader from '../containers/WorkspaceHeader';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    unloadActions: PropTypes.func.isRequired,
    organizationSet: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      match,
      fetchWorkspace,
      fetchContextActions,
      fetchOrgSet,
      organizationSet
    } = this.props;

    fetchWorkspace(match.params.fqon, match.params.workspaceId);
    fetchContextActions(match.params.fqon, match.params.workspaceId, 'workspaces', { filter: ['workspace.list', 'workspace.detail'] });

    // Keep org context synced in case of refresh
    if (match.params.fqon && !organizationSet.id) {
      fetchOrgSet(match.params.fqon);
    }
  }

  componentWillUnmount() {
    const { unloadEnvironments } = this.props;

    unloadEnvironments();
  }

  render() {
    const { workspace } = this.props;

    return (
      <Div>
        <WorkspaceNav />
        <Div paddingLeft="5em">
          <WorkspaceHeader
            model={workspace}
            {...this.props}
          />
          <WorkspaceRoutes />
        </Div>
      </Div>
    );
  }
}

export default compose(
  withMetaResource,
)(WorkspaceContext);

