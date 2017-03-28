import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import WorkspaceDetail from '../../components/WorkspaceDetail';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    workspace: state.metaResource.workspace.workspace,
    pending: state.metaResource.workspace.pending,
    navigation: state.workspaces.navigation
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(WorkspaceDetail);
