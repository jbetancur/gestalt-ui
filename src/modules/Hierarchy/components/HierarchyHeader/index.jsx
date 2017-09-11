import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import HierarchyActions from '../../components/HierarchyActions';
import HierarchyDetails from '../../components/HierarchyDetails';

const HierarchyHeader = (props) => {
  const { model, orangizationSetPending, contextActions, contextActionsPending } = props;

  return (
    <ContextNavigation
      model={model}
      pending={orangizationSetPending}
      pendingContextActions={contextActionsPending}
      breadcrumbComponent={<Breadcrumbs />}
      actionsComponent={<HierarchyActions organization={model} pending={orangizationSetPending} {...props} />}
      detailsComponent={<HierarchyDetails organization={model} pending={orangizationSetPending} {...props} />}
      actionsList={contextActions}
    />
  );
};

HierarchyHeader.propTypes = {
  orangizationSetPending: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  contextActions: PropTypes.array.isRequired,
  contextActionsPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default HierarchyHeader;
