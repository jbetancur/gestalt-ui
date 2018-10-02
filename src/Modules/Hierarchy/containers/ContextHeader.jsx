import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import ContextNavigation from './ContextNavigation';
import CreateMenu from './CreateMenu';
import OrganizationDetails from './OrganizationDetails';
import WorkspaceDetails from './WorkspaceDetails';
import EnvironmentDetails from './EnvironmentDetails';

const ContextHeader = ({ context, contextPending, ...props }) => {
  const { contextMeta } = context;
  let DetailsComponent;

  if (contextMeta.context === 'organization') {
    DetailsComponent = OrganizationDetails;
  }

  if (contextMeta.context === 'workspace') {
    DetailsComponent = WorkspaceDetails;
  }

  if (contextMeta.context === 'environment') {
    DetailsComponent = EnvironmentDetails;
  }

  return (
    <ContextNavigation
      model={context[contextMeta.context]}
      pending={contextPending}
      breadcrumbComponent={<Breadcrumbs lastIsActive />}
      actionsComponent={<CreateMenu {...props} />}
      detailsComponent={DetailsComponent && <DetailsComponent workspace={context[contextMeta.context]} pending={contextPending} {...props} />}
    />
  );
};

ContextHeader.propTypes = {
  context: PropTypes.object.isRequired,
  contextPending: PropTypes.bool.isRequired,
};

export default ContextHeader;
