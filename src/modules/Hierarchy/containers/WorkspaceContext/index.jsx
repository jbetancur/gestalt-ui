import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import WorkspaceContext from '../../components/WorkspaceContext';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    workspace: state.metaResource.workspace.workspace,
    pending: state.metaResource.workspace.pending,
    navigation: state.hierarchy.workspaceContextNavigation
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(WorkspaceContext);
