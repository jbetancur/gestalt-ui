import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import WorkspaceDetail from '../../components/WorkspaceDetail';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    workspace: state.workspaces.fetchOne.workspace,
    pending: state.workspaces.fetchOne.pending,
    navigation: state.workspaces.navigation
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceDetail);
