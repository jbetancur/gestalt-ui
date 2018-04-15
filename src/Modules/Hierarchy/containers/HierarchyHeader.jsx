import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import HierarchyActions from './HierarchyActions';
import OrganizationDetails from './OrganizationDetails';

const HierarchyHeader = (props) => {
  const { model, organizationSetPending, contextActions, contextActionsLoading } = props;

  return (
    <ContextNavigation
      model={model}
      pending={organizationSetPending}
      pendingContextActions={contextActionsLoading}
      breadcrumbComponent={<Breadcrumbs lastIsActive />}
      actionsComponent={<HierarchyActions organization={model} pending={organizationSetPending} {...props} />}
      detailsComponent={<OrganizationDetails organization={model} pending={organizationSetPending} {...props} />}
      actionsList={contextActions}
    />
  );
};

HierarchyHeader.propTypes = {
  organizationSetPending: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  contextActions: PropTypes.array.isRequired,
  contextActionsLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default HierarchyHeader;
