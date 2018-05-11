import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import EnvironmentActions from './EnvironmentActions';
import EnvironmentDetails from './EnvironmentDetails';

const EnvironmentHeader = ({ environment, environmentPending, ...props }) => (
  <ContextNavigation
    model={environment}
    pending={environmentPending}
    breadcrumbComponent={<Breadcrumbs lastIsActive />}
    actionsComponent={<EnvironmentActions environment={environment} pending={environmentPending} {...props} />}
    detailsComponent={<EnvironmentDetails workspace={environment} pending={environmentPending} {...props} />}
  />
);

EnvironmentHeader.propTypes = {
  environment: PropTypes.object.isRequired,
  environmentPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default EnvironmentHeader;
