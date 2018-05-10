import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import HierarchyRoutes from '../routes/HierarchyRoutes';
import HierarchyNav from '../containers/HierarchyNav';
import HierarchyHeader from '../containers/HierarchyHeader';

class HierarchyContext extends PureComponent {
  static propTypes = {
    organizationSet: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    unloadWorkspaces: PropTypes.func.isRequired,
    unloadWorkspace: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchOrgSet, unloadWorkspace } = this.props;
    fetchOrgSet(match.params.fqon);
    unloadWorkspace();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.fqon && prevProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.unloadWorkspace();
      this.props.unloadEnvironments();
    }
  }

  componentWillUnmount() {
    this.props.unloadEnvironments();
  }

  render() {
    const { organizationSet, match } = this.props;

    return (
      <Div>
        <HierarchyNav showOnRootOnly={match.params.fqon === 'root'} />
        <Div paddingLeft="5em" paddingBottom="56px">
          <HierarchyHeader
            model={organizationSet}
            {...this.props}
          />
          <HierarchyRoutes />
        </Div>
      </Div>
    );
  }
}

export default compose(
  withMetaResource,
)(HierarchyContext);
