import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, ContextNavigation } from 'Modules/ContextManagement';
import WorkspaceActions from '../components/WorkspaceActions';
import WorkspaceDetails from '../components/WorkspaceDetails';

const WorkspaceHeader = (props) => {
  const { workspace, workspacePending, contextActions, contextActionsPending } = props;

  return (
    <ContextNavigation
      model={workspace}
      pending={workspacePending}
      pendingContextActions={contextActionsPending}
      breadcrumbComponent={<Breadcrumbs lastIsActive />}
      actionsComponent={<WorkspaceActions workspace={workspace} pending={workspacePending} {...props} />}
      detailsComponent={<WorkspaceDetails workspace={workspace} pending={workspacePending} {...props} />}
      actionsList={contextActions}
    />
  );
};

WorkspaceHeader.propTypes = {
  workspace: PropTypes.object.isRequired,
  workspacePending: PropTypes.bool.isRequired,
  contextActions: PropTypes.array.isRequired,
  contextActionsPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default WorkspaceHeader;
