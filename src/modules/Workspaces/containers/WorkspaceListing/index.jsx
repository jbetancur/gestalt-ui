import { connect } from 'react-redux';
import WorkspaceItem from '../../components/WorkspaceItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    workspaces: state.workspaces.fetchAll.items,
    pending: state.workspaces.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(WorkspaceItem);
