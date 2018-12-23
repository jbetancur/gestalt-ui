import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import CreateMenu from './CreateMenu';
import OrganizationDetails from './OrganizationDetails';

const HierarchyHeader = ({ model, hierarchyContext: { contextPending }, ...props }) => (
  <ContextNavigation
    model={model}
    pending={contextPending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<CreateMenu {...props} />}
    detailsComponent={<OrganizationDetails organization={model} pending={contextPending} {...props} />}
  />
);

HierarchyHeader.propTypes = {
  hierarchyContext: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default HierarchyHeader;
