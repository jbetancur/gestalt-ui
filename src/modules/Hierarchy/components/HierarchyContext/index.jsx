import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import HierarchyActions from '../../components/HierarchyActions';
import HierarchyDetails from '../../components/HierarchyDetails';

class HierarchyContext extends PureComponent {
  static propTypes = {
    orangizationSetPending: PropTypes.bool.isRequired,
    model: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { view: 'hierarchy', index: 0 };
  }

  render() {
    const { orangizationSetPending, model } = this.props;

    return (
      <div>
        <ContextNavigation
          pending={orangizationSetPending}
          breadcrumbComponent={<Breadcrumbs />}
          actionsComponent={<HierarchyActions organization={model} pending={orangizationSetPending} {...this.props} />}
          detailsComponent={<HierarchyDetails organization={model} pending={orangizationSetPending} {...this.props} />}
        />
      </div>
    );
  }
}

export default HierarchyContext;
