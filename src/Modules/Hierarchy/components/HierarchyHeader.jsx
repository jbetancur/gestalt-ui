import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, ContextNavigation } from 'Modules/ContextManagement';
import HierarchyActions from '../components/HierarchyActions';
import OrganizationDetails from '../components/OrganizationDetails';

const HierarchyHeader = (props) => {
  const { model, organizationSetPending, contextActions, contextActionsPending } = props;

  return (
    <ContextNavigation
      model={model}
      pending={organizationSetPending}
      pendingContextActions={contextActionsPending}
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
  contextActionsPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default HierarchyHeader;
