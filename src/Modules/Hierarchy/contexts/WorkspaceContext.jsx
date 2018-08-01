import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withOrganization, withEnvironments, withWorkspace } from 'Modules/MetaResource';
import Div from 'components/Div';
import WorkspaceRoutes from '../routes/WorkspaceRoutes';
import WorkspaceNav from '../containers/WorkspaceNav';
import WorkspaceHeader from '../containers/WorkspaceHeader';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationActions: PropTypes.object.isRequired,
    workspaceActions: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      workspaceActions,
      organizationActions,
      organizationSet
    } = this.props;

    workspaceActions.fetchWorkspace({ fqon: match.params.fqon, id: match.params.workspaceId });

    // Keep org context synced in case of refresh
    if (match.params.fqon && !organizationSet.id) {
      organizationActions.fetchOrgSet({ fqon: match.params.fqon });
    }
  }

  render() {
    const { workspace } = this.props;

    return (
      <Div>
        <WorkspaceNav />
        <Div paddingLeft="5em" paddingBottom="56px">
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
  withOrganization(),
  withEnvironments(),
  withWorkspace(),
)(WorkspaceContext);
