import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import WorkspaceActions from './WorkspaceActions';
import WorkspaceDetails from './WorkspaceDetails';

const WorkspaceHeader = ({ context: { workspace }, contextPending, ...props }) => (
  <ContextNavigation
    model={workspace}
    pending={contextPending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<WorkspaceActions workspace={workspace} pending={contextPending} {...props} />}
    detailsComponent={<WorkspaceDetails workspace={workspace} pending={contextPending} {...props} />}
  />
);

WorkspaceHeader.propTypes = {
  context: PropTypes.object.isRequired,
  contextPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default WorkspaceHeader;
