import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import EnvironmentActions from './EnvironmentActions';
import EnvironmentDetails from './EnvironmentDetails';

const EnvironmentHeader = ({ context: { environment }, contextPending, ...props }) => (
  <ContextNavigation
    model={environment}
    pending={contextPending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<EnvironmentActions environment={environment} pending={contextPending} {...props} />}
    detailsComponent={<EnvironmentDetails workspace={environment} pending={contextPending} {...props} />}
  />
);

EnvironmentHeader.propTypes = {
  context: PropTypes.object.isRequired,
  contextPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default EnvironmentHeader;
