import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import EnvironmentActions from './EnvironmentActions';
import EnvironmentDetails from './EnvironmentDetails';

const EnvironmentHeader = (props) => {
  const { environment, environmentPending, contextActions, contextActionsLoading } = props;

  return (
    <ContextNavigation
      model={environment}
      pending={environmentPending}
      pendingContextActions={contextActionsLoading}
      breadcrumbComponent={<Breadcrumbs lastIsActive />}
      actionsComponent={<EnvironmentActions environment={environment} pending={environmentPending} {...props} />}
      detailsComponent={<EnvironmentDetails workspace={environment} pending={environmentPending} {...props} />}
      actionsList={contextActions}
    />
  );
};

EnvironmentHeader.propTypes = {
  environment: PropTypes.object.isRequired,
  environmentPending: PropTypes.bool.isRequired,
  contextActions: PropTypes.array.isRequired,
  contextActionsLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default EnvironmentHeader;
