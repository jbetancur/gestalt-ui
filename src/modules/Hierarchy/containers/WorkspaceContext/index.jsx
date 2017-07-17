import { connect } from 'react-redux';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import WorkspaceContext from '../../components/WorkspaceContext';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    navigation: state.hierarchy.workspaceContextNavigation,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(withContext(WorkspaceContext)));
