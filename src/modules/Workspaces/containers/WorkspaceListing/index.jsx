import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import { sortBy } from 'lodash';
import WorkspaceItem from '../../components/WorkspaceItem';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    workspaces: sortBy(state.workspaces.fetchAll.workspaces, 'name'),
    pending: state.workspaces.fetchAll.pending
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceItem);
