import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import WorkspaceActions from './WorkspaceActions';
import WorkspaceDetails from './WorkspaceDetails';

const WorkspaceHeader = (props) => {
  const { workspace, workspacePending, contextActions, contextActionsLoading } = props;

  return (
    <ContextNavigation
      model={workspace}
      pending={workspacePending}
      pendingContextActions={contextActionsLoading}
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
  contextActionsLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default WorkspaceHeader;
