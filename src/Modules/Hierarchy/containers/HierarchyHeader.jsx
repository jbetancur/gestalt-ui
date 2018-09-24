import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import HierarchyActions from './HierarchyActions';
import OrganizationDetails from './OrganizationDetails';

const HierarchyHeader = ({ model, contextPending, ...props }) => (
  <ContextNavigation
    model={model}
    pending={contextPending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<HierarchyActions organization={model} pending={contextPending} {...props} />}
    detailsComponent={<OrganizationDetails organization={model} pending={contextPending} {...props} />}
  />
);

HierarchyHeader.propTypes = {
  contextPending: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default HierarchyHeader;
