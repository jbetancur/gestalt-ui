import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import HierarchyRoutes from '../routes/HierarchyRoutes';
import HierarchyNav from '../components/HierarchyNav';
import HierarchyHeader from '../components/HierarchyHeader';
import actions from '../actions';

class HierarchyContext extends PureComponent {
  static propTypes = {
    organizationSet: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    unloadWorkspaces: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchContextActions, contextManagerActions } = this.props;

    fetchContextActions(match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
    contextManagerActions.unloadWorkspaceContext();
    contextManagerActions.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.fqon && nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchContextActions(nextProps.match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
      this.props.unloadEnvironments();
    }
  }

  componentWillUnmount() {
    // Clean up the context when it is changed
    this.props.onUnloadOrgSet();
    this.props.unloadWorkspaces();
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

function mapStateToProps(state) {
  return {
    self: state.metaResource.self.self,
  };
}

export default connect(mapStateToProps, actions)(withMetaResource(withContext(HierarchyContext)));
