import { connect } from 'react-redux';
import WorkspaceDetail from '../../components/WorkspaceDetail';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    workspace: state.workspaces.fetchOne.workspace,
    pending: state.workspaces.fetchOne.pending,
    navigation: state.workspaces.navigation
  };
}

export default connect(mapStateToProps, actions)(WorkspaceDetail);
