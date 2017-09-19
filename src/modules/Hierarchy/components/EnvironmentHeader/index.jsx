import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import EnvironmentActions from '../../components/EnvironmentActions';
import EnvironmentDetails from '../../components/EnvironmentDetails';

const EnvironmentHeader = (props) => {
  const { environment, environmentPending, contextActions, contextActionsPending } = props;

  return (
    <ContextNavigation
      model={environment}
      pending={environmentPending}
      pendingContextActions={contextActionsPending}
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
  contextActionsPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default EnvironmentHeader;
