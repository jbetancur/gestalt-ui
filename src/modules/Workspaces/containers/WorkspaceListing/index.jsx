import { connect } from 'react-redux';
import { appActions } from 'App';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import WorkspaceItem from '../../components/WorkspaceItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    workspaces: sortBy(state.workspaces.fetchAll.workspaces, 'name'),
    pending: state.workspaces.fetchAll.pending
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(WorkspaceItem);
