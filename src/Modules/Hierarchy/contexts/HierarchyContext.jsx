import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource, withEnvironments, withWorkspace } from 'Modules/MetaResource';
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
    workspaceActions: PropTypes.object.isRequired,
    environmentsActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, fetchOrgSet, workspaceActions } = this.props;
    fetchOrgSet(match.params.fqon);
    workspaceActions.unloadWorkspace();
  }

  componentDidUpdate(prevProps) {
    const { match, workspaceActions, environmentsActions } = this.props;
    if (prevProps.match.params.fqon && prevProps.match.params.fqon !== match.params.fqon) {
      workspaceActions.unloadWorkspace();
      environmentsActions.unloadEnvironments();
    }
  }

  componentWillUnmount() {
    const { environmentsActions } = this.props;

    environmentsActions.unloadEnvironments();
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
  withEnvironments(),
  withWorkspace(),
)(HierarchyContext);
