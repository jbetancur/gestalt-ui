import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import WorkspaceActions from './WorkspaceActions';
import WorkspaceDetails from './WorkspaceDetails';

const WorkspaceHeader = ({ workspace, workspacePending, ...props }) => (
  <ContextNavigation
    model={workspace}
    pending={workspacePending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<WorkspaceActions workspace={workspace} pending={workspacePending} {...props} />}
    detailsComponent={<WorkspaceDetails workspace={workspace} pending={workspacePending} {...props} />}
  />
);

WorkspaceHeader.propTypes = {
  workspace: PropTypes.object.isRequired,
  workspacePending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default WorkspaceHeader;
