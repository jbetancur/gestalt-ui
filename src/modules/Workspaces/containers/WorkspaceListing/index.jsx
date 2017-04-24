import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import { translate } from 'react-i18next';
import WorkspaceItem from '../../components/WorkspaceItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    workspaces: state.metaResource.workspaces.workspaces,
    pending: state.metaResource.workspaces.pending
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(translate()(WorkspaceItem));
