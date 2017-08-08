import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import HierarchyActions from '../../components/HierarchyActions';
import HierarchyDetails from '../../components/HierarchyDetails';

const HierarchyHeader = (props) => {
  const { model, orangizationSetPending } = props;

  return (
    <div>
      <ContextNavigation
        pending={orangizationSetPending}
        breadcrumbComponent={<Breadcrumbs />}
        actionsComponent={<HierarchyActions organization={model} pending={orangizationSetPending} {...props} />}
        detailsComponent={<HierarchyDetails organization={model} pending={orangizationSetPending} {...props} />}
      />
    </div>
  );
};

HierarchyHeader.propTypes = {
  orangizationSetPending: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
};

export default HierarchyHeader;
