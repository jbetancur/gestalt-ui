import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import HierarchyRoutes from '../routes/HierarchyRoutes';
import HierarchyNav from '../components/HierarchyNav';
import HierarchyHeader from '../components/HierarchyHeader';

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
    fetchContextActions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchOrgSet, fetchContextActions, unloadWorkspace } = this.props;
    fetchOrgSet(match.params.fqon);
    fetchContextActions(match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
    unloadWorkspace();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.fqon && nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchContextActions(nextProps.match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
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
        <Div paddingLeft="5em">
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
