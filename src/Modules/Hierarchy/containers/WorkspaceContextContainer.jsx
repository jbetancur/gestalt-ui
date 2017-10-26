import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withContext } from 'Modules/ContextManagement';
import Div from 'components/Div';
import WorkspaceRoutes from '../routes/WorkspaceRoutes';
import WorkspaceNav from '../components/WorkspaceNav';
import WorkspaceHeader from '../components/WorkspaceHeader';
import actions from '../actions';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    unloadActions: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchWorkspace, match, fetchContextActions } = this.props;
    fetchWorkspace(match.params.fqon, match.params.workspaceId);
    fetchContextActions(match.params.fqon, match.params.workspaceId, 'workspaces', { filter: ['workspace.list', 'workspace.detail'] });
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

export default connect(null, actions)(withMetaResource(withContext(WorkspaceContext)));
