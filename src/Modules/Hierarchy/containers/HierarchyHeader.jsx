import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import HierarchyActions from './HierarchyActions';
import OrganizationDetails from './OrganizationDetails';

const HierarchyHeader = ({ model, organizationSetPending, ...props }) => (
  <ContextNavigation
    model={model}
    pending={organizationSetPending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<HierarchyActions organization={model} pending={organizationSetPending} {...props} />}
    detailsComponent={<OrganizationDetails organization={model} pending={organizationSetPending} {...props} />}
  />
);

HierarchyHeader.propTypes = {
  organizationSetPending: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default HierarchyHeader;
