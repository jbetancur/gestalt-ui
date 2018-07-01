import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withOrganization, withEnvironments, withWorkspace } from 'Modules/MetaResource';
import Div from 'components/Div';
import HierarchyRoutes from '../routes/HierarchyRoutes';
import HierarchyNav from '../containers/HierarchyNav';
import HierarchyHeader from '../containers/HierarchyHeader';

class HierarchyContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
    organizationActions: PropTypes.object.isRequired,
    workspaceActions: PropTypes.object.isRequired,
    environmentsActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, organizationActions, workspaceActions } = this.props;
    organizationActions.fetchOrgSet({ fqon: match.params.fqon });
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
  withOrganization(),
  withEnvironments(),
  withWorkspace(),
)(HierarchyContext);
