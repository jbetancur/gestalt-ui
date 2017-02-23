import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import WorkspaceItem from '../../components/WorkspaceItem';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    workspaces: state.workspaces.fetchAll.workspaces,
    pending: state.workspaces.fetchAll.pending
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceItem);
